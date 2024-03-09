'use client'

import { useAppSelector } from '@/lib/redux/store'
import axios from 'axios'
import { useContext, useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { CategoryI, GenreI, LanguageI, StoryI } from '@/typings'
import LoadingPulse from '../loading/LoadingSpinner'
import Dropzone from 'react-dropzone'
import * as yup from 'yup'
import { useFormik } from 'formik'
import { v4 as uuidv4 } from 'uuid'
import { StoryContext } from '@/lib/StoryProvider'

const getCategoryName = (type: string) => {
  switch (type) {
    case 'shortStory':
      return 'Short Story'

    case 'book':
      return 'Book'

    case 'lightNovel':
      return 'Light Novel'

    default:
      return 'Unidentified'
  }
}

function StoryForm({ type }: { type: string }) {
  const user = useAppSelector((state) => state.auth.user)
  const token = useAppSelector((state) => state.auth.token)

  const params = useParams()
  const router = useRouter()

  const [isLoading, setIsLoading] = useState(false)

  const [story, setStory] = useState<StoryI | null>(null)
  const [languages, setLanguages] = useState([])
  const [genres, setGenres] = useState([])
  const [categories, setCategories] = useState([])
  const [Error, setError] = useState<string>('')

  const { stories, SetStories } = useContext(StoryContext)

  const refreshStories = async () => {
    const stories = await axios.get(
      `http://localhost:8080/api/v1/stories/user/${user._id}`
    )

    const storyList = stories.data.data
    SetStories(storyList)
  }

  const getStory = async (id: string) => {
    const story = await axios.get(`http://localhost:8080/api/v1/stories/${id}`)

    setStory(story.data.data)

    setFieldValue('title', story.data.data.title)
    setFieldValue('description', story.data.data.description)
    setFieldValue('active', story.data.data.active.toString())
    setFieldValue('readerAccess', story.data.data.readerAccess)
    setFieldValue('price', story.data.data.price.toString())
    setFieldValue('category', story.data.data.category._id)
    setFieldValue('editorId', story.data.data.editorId || '')
    setFieldValue('status', story.data.data.status)
    setFieldValue('languageName', story.data.data.languageName._id)
    setFieldValue('genre', story.data.data.genre._id)
    setFieldValue('picturePath', story.data.data.picturePath || '')
    setFieldValue('pictureName', story.data.data.pictureName || '')
    setFieldValue('nsfw', story.data.data.nsfw.toString())
    setIsLoading(false)
  }

  const getLanguages = async () => {
    const languages = await axios.get(`http://localhost:8080/api/v1/language`)

    setFieldValue('languageName', languages.data.data[0]._id)

    setLanguages(languages.data.data)
  }

  const getGenres = async () => {
    const genres = await axios.get(`http://localhost:8080/api/v1/genre`)

    setFieldValue('genre', genres.data.data[0]._id)

    setGenres(genres.data.data)
  }

  const getCategories = async () => {
    const categories = await axios.get(`http://localhost:8080/api/v1/category`)

    setFieldValue('category', categories.data.data[0]._id)

    setCategories(categories.data.data)
  }

  const StorySchema = yup.object().shape({
    title: yup
      .string()
      .required('Must have a title')
      .max(100, 'Must be under 100 characters'),
    description: yup.string().required('Must have a description'),
    active: yup.string().required('Active is required'),
    readerAccess: yup.string().required('Reader Access is required'),
    price: yup.string().required('Price is required'),
    category: yup.string().required('Category is required'),
    editorId: yup.string().optional(),
    status: yup.string().required('Status is required'),
    languageName: yup.string().required('Language name is required'),
    genre: yup.string().required('Genre is required'),
    nsfw: yup.string().required('NSFW is required'),
  })

  // Gets story when type == update
  useEffect(() => {
    getCategories()
    getLanguages()
    getGenres()

    if (type == 'update') {
      setIsLoading(true)
      getStory(params.id as string)
    }
  }, [params.id, type]) // eslint-disable-line

  // Set default values when story is available
  let initialValues = {
    title: '',
    description: '',
    active: 'true',
    nsfw: 'false',
    readerAccess: 'free',
    price: '0.00',
    category: '',
    status: 'Incomplete',
    languageName: '',
    genre: '',
    editorId: '',
    picturePath: '',
    pictureName: '',
  }

  const formik = useFormik({
    initialValues: initialValues,

    validationSchema: StorySchema,

    // Handle form submission
    onSubmit: async (values: any, onSubmitProps: any) => {
      setError('')
      const formData = new FormData()
      for (let value in values) {
        // @ts-ignore
        if (value === 'picture' && !value.picture) {
          continue
        }
        formData.append(value, values[value])
      }
      if (values.picture) {
        formData.append('picture', values.picture)
      }

      if (type === 'new') {
        try {
          await axios.post(
            `http://localhost:8080/api/v1/stories/new`,

            formData,

            {
              headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: 'Bearer ' + token,
              },
            }
          )
        } catch (error: any) {
          setError(error.response.data.message)
        }
        await refreshStories()
      } else if (type === 'update') {
        try {
          await axios.patch(
            `http://localhost:8080/api/v1/stories/story/${params.id}`,
            formData,
            {
              headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: 'Bearer ' + token,
              },
            }
          )
        } catch (error: any) {
          setError(error.response.data.message)
        }
        refreshStories()

        setIsLoading(false)
      }

      setIsLoading(false)
      router.push(`/profile/myStories`)
    },
  })

  const {
    values,
    errors,
    touched,
    handleBlur,
    handleChange,
    handleSubmit,
    setFieldValue,
    resetForm,
  } = formik

  if (isLoading) return <LoadingPulse />

  // Checks if signed in and the correct role and if its the owner for updating
  if (
    (story && user!._id !== story?.userId._id) ||
    !token ||
    user!.role === 'Reader'
  )
    return <p className="p-10 text-center text-3xl">Access Denied</p>

  return (
    <form
      onSubmit={handleSubmit}
      className="container m-auto flex max-w-[1250px] flex-col items-center py-5"
    >
      <div className="flex flex-col items-center gap-2 p-2 md:flex-row md:flex-wrap md:justify-center">
        {/* Title */}
        <div className="flex w-full flex-col items-center">
          <div className="flex w-full flex-col">
            <label>Title: </label>
            <input
              className={`w-full rounded-lg border border-gray-300 p-1 ${errors.title && Boolean(touched.title) ? 'border-4 border-red-500' : ''}`}
              id="title"
              type="text"
              onChange={handleChange}
              value={values.title}
              name="title"
            />
          </div>
          {errors.title && Boolean(touched.title) && (
            <span className="text-red-500">{errors.title}</span>
          )}
        </div>

        {/* Description */}
        <div className="flex w-full flex-col items-center">
          <div className="flex w-full flex-col">
            <label>Description: </label>
            <textarea
              className={`w-full rounded-lg border border-gray-300 p-1 ${errors.description && Boolean(touched.description) ? 'border-4 border-red-500 ' : ''}`}
              id="description"
              onChange={handleChange}
              value={values.description}
              name="description"
            />
          </div>
          {errors.description && Boolean(touched.description) && (
            <span className="text-red-500">{errors.description}</span>
          )}
        </div>

        {/* Active, RA, nsfw & Prcie */}
        <div className="flex flex-col items-center md:flex-row md:gap-10">
          {/* Active */}
          <div className="flex flex-col">
            <label>Active: </label>
            <div className="flex gap-2">
              <label
                htmlFor="true"
                className={`cursor-pointer rounded-lg border border-blue-400 px-2 py-1 ${
                  values.active === 'true'
                    ? 'bg-blue-500 text-white'
                    : 'bg-blue-100 text-gray-600'
                }`}
              >
                Active
              </label>
              <input
                type="radio"
                id="true"
                onChange={handleChange}
                className="hidden"
                name="active"
                value="true"
              />
              <label
                htmlFor="false"
                className={`cursor-pointer rounded-lg border border-blue-400 px-2 py-1 ${
                  values.active === 'false'
                    ? 'bg-blue-500 text-white'
                    : 'bg-blue-100 text-gray-600'
                }`}
              >
                Deactive
              </label>
              <input
                type="radio"
                id="false"
                onChange={handleChange}
                value={'false'}
                className="hidden"
                name="active"
              />
            </div>
          </div>

          {/* NSFW */}
          <div className="flex flex-col">
            <label>NSFW: </label>
            <div className="flex gap-2">
              <label
                htmlFor="true1"
                className={`cursor-pointer rounded-lg border border-blue-400 px-2 py-1 ${
                  values.nsfw === 'true'
                    ? 'bg-blue-500 text-white'
                    : 'bg-blue-100 text-gray-600'
                }`}
              >
                Yes
              </label>
              <input
                type="radio"
                id="true1"
                onChange={handleChange}
                className="hidden"
                name="nsfw"
                value="true"
              />
              <label
                htmlFor="false1"
                className={`cursor-pointer rounded-lg border border-blue-400 px-2 py-1 ${
                  values.nsfw === 'false'
                    ? 'bg-blue-500 text-white'
                    : 'bg-blue-100 text-gray-600'
                }`}
              >
                No
              </label>
              <input
                type="radio"
                id="false1"
                onChange={handleChange}
                value={'false'}
                className="hidden"
                name="nsfw"
              />
            </div>
          </div>

          {/* RA & Price */}
          <div className="flex w-full items-center gap-5">
            {/* Readers Access */}
            <div className="flex w-fit flex-col">
              <div className="flex flex-col">
                <label className=" text-nowrap ">Reader Access:</label>

                <select
                  className="rounded-lg border border-gray-300 p-1"
                  id="readerAccess"
                  onChange={(e) => {
                    setFieldValue('readerAccess', e.target.value)
                    if (e.target.value === 'free')
                      setFieldValue('price', '0.00')
                  }}
                  value={values.readerAccess}
                  name="readerAccess"
                >
                  <option value="free">Free</option>
                  {/* <option value="payFull">Pay Full</option> */}
                  {/* <option value="payByChapter">Pay By Chapter</option> */}
                </select>
              </div>
            </div>

            {/* Price */}
            <div className="w-full">
              <div className="flex w-full flex-col">
                <label>Price: </label>
                <input
                  disabled={values.readerAccess === 'free'}
                  className={`w-full rounded-lg border border-gray-300 p-1 ${values.readerAccess === 'free' ? 'bg-gray-200' : ''} ${errors.price && Boolean(touched.price) ? 'border-4 border-red-500' : ''}`}
                  id="price"
                  onChange={handleChange}
                  value={values.price}
                  type="text"
                  name="price"
                />
              </div>

              {errors.price && Boolean(touched.price) && (
                <span className="text-red-500">{errors.price}</span>
              )}
            </div>
          </div>
        </div>

        {/* Category & Genre */}
        <div className="flex w-full flex-col sm:flex-row sm:gap-5">
          {/* Category */}
          <div className="flex w-full flex-col">
            <div className="flex w-full flex-col">
              <label className=" text-nowrap ">Category: </label>
              <select
                className="w-full rounded-lg border border-gray-300 p-1"
                id="category"
                onChange={(e) => {
                  setFieldValue('category', e.target.value)
                  if (e.target.value === 'free') setFieldValue('price', '0.00')
                }}
                value={values.category}
                name="category"
              >
                {categories!.map((category: CategoryI) => (
                  <option key={category._id} value={category._id}>
                    {getCategoryName(category.name)}
                  </option>
                ))}
              </select>
            </div>
            {errors.category && Boolean(touched.category) && (
              <span className="text-red-500">{errors.category}</span>
            )}
          </div>

          {/* Genre */}
          <div className="flex w-full flex-col">
            <div className="flex w-full flex-col">
              <label className=" text-nowrap ">Genre: </label>
              <select
                className="w-full rounded-lg border border-gray-300 p-1"
                id="genre"
                onChange={(e) => {
                  setFieldValue('genre', e.target.value)
                  if (e.target.value === 'free') setFieldValue('price', '0.00')
                }}
                value={values.genre}
                name="genre"
              >
                {genres!.map((genre: GenreI) => (
                  <option key={genre._id} value={genre._id}>
                    {genre.name}
                  </option>
                ))}
              </select>
            </div>
            {errors.genre && Boolean(touched.genre) && (
              <span className="text-red-500">{errors.genre}</span>
            )}
          </div>
        </div>

        {/* Language & Status */}
        <div className="flex w-full flex-col sm:flex-row sm:gap-5">
          {/* Language */}
          <div className="flex w-full flex-col">
            <div className="flex w-full flex-col">
              <label className=" text-nowrap ">Language: </label>
              <select
                className="w-full rounded-lg border border-gray-300 p-1"
                id="languageName"
                onChange={(e) => {
                  setFieldValue('languageName', e.target.value)
                  if (e.target.value === 'free') setFieldValue('price', '0.00')
                }}
                value={values.languageName}
                name="languageName"
              >
                {languages!.map((language: LanguageI) => (
                  <option key={language._id} value={language._id}>
                    {language.name}
                  </option>
                ))}
              </select>
            </div>
            {errors.languageName && Boolean(touched.languageName) && (
              <span className="text-red-500">{errors.languageName}</span>
            )}
          </div>

          {/* Status */}
          <div className="flex w-full flex-col">
            <div className="flex w-full flex-col">
              <label>Status: </label>
              <select
                className="rounded-lg border border-gray-300 p-1"
                id="status"
                onChange={handleChange}
                value={values.status}
                name="status"
              >
                <option value="Incomplete">Incomplete</option>
                <option value="Complete">Complete</option>
              </select>
            </div>
          </div>
        </div>

        {/* Editor */}
        <div className="flex w-full flex-col">
          <label htmlFor="editorId">Editor: </label>
          <input
            className={`$ w-full rounded-lg border border-gray-300 p-1`}
            id="editorId"
            type="text"
            onChange={handleChange}
            value={values.editorId}
            name="editorId"
          />
        </div>

        <Dropzone
          multiple={false}
          onDrop={(acceptedFiles) => {
            setFieldValue('picture', acceptedFiles[0])
            //@ts-ignore
            setFieldValue('pictureName', acceptedFiles[0].name)
            setFieldValue(
              'picturePath',
              uuidv4() + '.' + acceptedFiles[0].type.slice(6)
            )
          }}
        >
          {({ getRootProps, getInputProps }) => (
            <div
              {...getRootProps()}
              className="flex h-24  w-full cursor-pointer items-center justify-center border-2 border-dashed border-blue-400 p-4 text-xl font-semibold text-gray-700"
            >
              <input {...getInputProps()} />
              {values.picturePath === '' ? (
                <p>Add Picture Here</p>
              ) : (
                <div>
                  <p>{values.pictureName}</p>
                </div>
              )}
            </div>
          )}
        </Dropzone>
      </div>
      <input
        className="cursor-pointer rounded-lg bg-blue-500 px-2 py-1 text-lg text-white hover:bg-blue-600 hover:text-gray-100"
        type="submit"
      />

      {/* Error */}
      <div
        className={`${Error.length > 0 ? 'mt-3 rounded-lg border border-red-700 bg-red-300 p-2 text-black' : ''}`}
      >
        {Error && (
          <p className="text-center font-semibold text-black">{Error}</p>
        )}
      </div>
      <p className="mt-5 truncate text-xl text-blue-600">
        Payment Options Coming Soon!
      </p>
    </form>
  )
}

export default StoryForm
