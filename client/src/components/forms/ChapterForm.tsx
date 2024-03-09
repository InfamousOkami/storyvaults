'use client'

import { useAppSelector } from '@/lib/redux/store'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ChapterI, StoryI } from '@/typings'
import LoadingPulse from '../loading/LoadingSpinner'
import * as yup from 'yup'
import { useFormik } from 'formik'

// TODO: Add better text editor for content

function ChapterForm({ type }: { type: string }) {
  const router = useRouter()
  const user = useAppSelector((state) => state.auth.user)
  const token = useAppSelector((state) => state.auth.token)

  const params = useParams()

  const [isLoading, setIsLoading] = useState(false)

  const [chapter, setChapter] = useState<ChapterI | null>(null)
  const [story, setStory] = useState<StoryI | null>(null)
  const [Error, setError] = useState<string>('')

  const getChapter = async (storyId: string, chapterNumber: string) => {
    try {
      const chapter = await axios.get(
        `http://localhost:8080/api/v1/chapter/${storyId}/${chapterNumber}`
      )

      setChapter(chapter.data.data)

      if (chapter) {
        setFieldValue('name', chapter.data.data.name)
        setFieldValue('chapterContent', chapter.data.data.chapterContent)
        setFieldValue('chapterNumber', chapter.data.data.chapterNumber)
        setFieldValue('wordCount', chapter.data.data.wordCount)
      }
    } catch (error: any) {
      setError(error.response.data?.message)
    }

    setIsLoading(false)
  }

  const getStory = async (storyId: string) => {
    try {
      const story = await axios.get(
        `http://localhost:8080/api/v1/stories/${storyId}`
      )

      setStory(story.data.data)

      if (story) {
        setFieldValue('storyNumber', story.data.data.chapterAmount + 1)
      }
    } catch (error: any) {
      setError(error?.response.data.message)
    }
    setIsLoading(false)
  }

  const ChapterSchema = yup.object().shape({
    name: yup
      .string()
      .required('Must have a title')
      .max(100, 'Must be under 100 characters'),
    chapterContent: yup.string().required('Contet is required'),
    chapterNumber: yup.number().required('WordCount is required'),
    wordCount: yup.number(),
  })

  // Gets chapter when type == update
  useEffect(() => {
    if (type == 'update') {
      setIsLoading(true)
      getChapter(params.id as string, params.chapterNumber as string)
    }
  }, [params.id, params.chapterNumber, type]) // eslint-disable-line

  // Gets story when type == new
  useEffect(() => {
    if (type == 'new') {
      setIsLoading(true)
      getStory(params.id as string)
      console.log(params.id)
    }
  }, [params.id, type]) // eslint-disable-line

  // Set default values when story is available
  let initialValues = {
    name: '',
    chapterNumber: 1,
    chapterContent: '',
    wordCount: 0,
  }

  const formik = useFormik({
    initialValues: initialValues,

    validationSchema: ChapterSchema,

    // Handle form submission
    onSubmit: async (values: any, onSubmitProps: any) => {
      setIsLoading(true)

      const formData = new FormData()
      for (let value in values) {
        formData.append(value, values[value])
      }
      formData.append('storyId', params.id as string)

      if (type === 'new') {
        try {
          // await createStory(formData, token!)
          await axios.post(
            `http://localhost:8080/api/v1/chapter/new`,
            formData,
            {
              headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + token,
              },
            }
          )
        } catch (error: any) {
          setError(error.response.data.message)
        }
      } else if (type === 'update') {
        try {
          await axios.patch(
            `http://localhost:8080/api/v1/chapter/update/${chapter!._id}`,
            formData,
            {
              headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + token,
              },
            }
          )
        } catch (error: any) {
          setError(error.response.data.message)
        }
      }
      setIsLoading(false)
      router.push(`/story/${params.id}/${params.slug}`)
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
    chapter &&
    user!._id !== chapter?.userId._id &&
    chapter?.storyId.editorId !== user._id &&
    !token &&
    user!.role === 'Reader'
  )
    return <p className="p-10 text-center text-3xl">Access Denied</p>

  return (
    <form
      onSubmit={handleSubmit}
      className="container m-auto  flex flex-col items-center py-5"
    >
      <div className="flex w-full flex-col items-center justify-center gap-2 p-2 md:flex-row md:flex-wrap">
        <div className="flex w-full flex-col gap-5 md:flex-row">
          {/* Name */}
          <div className="flex w-full flex-col items-center">
            <div className="flex w-full flex-col">
              <label>Title: </label>
              <input
                className={`w-full rounded-lg border border-gray-300 p-1 ${errors.name && Boolean(touched.name) ? 'border-4 border-red-500' : ''}`}
                id="name"
                type="text"
                onChange={handleChange}
                value={values.name}
                name="name"
              />
            </div>
            {errors.name && Boolean(touched.name) && (
              <span className="text-red-500">{errors.name}</span>
            )}
          </div>

          {/* Chapter Number */}
          <div className="flex w-full flex-1 flex-col items-center">
            <div className="flex w-full flex-col">
              <label className="w-[125px]">Chapter Number: </label>
              <input
                className={`rounded-lg border border-gray-300 p-1 ${errors.chapterNumber && Boolean(touched.chapterNumber) ? 'border-4 border-red-500' : ''}`}
                id="chapterNumber"
                type="number"
                onChange={handleChange}
                value={values.chapterNumber}
                name="chapterNumber"
              />
            </div>
            {errors.name && Boolean(touched.name) && (
              <span className="text-red-500">{errors.name}</span>
            )}
          </div>
        </div>

        {/* chapterContent */}
        <div className="flex w-full flex-col items-center">
          <div className="flex w-full flex-col">
            <label>Content: </label>
            <textarea
              className={`w-full rounded-lg border border-gray-300 p-1 ${errors.chapterContent && Boolean(touched.chapterContent) ? 'border-4 border-red-500 ' : ''}`}
              id="chapterContent"
              onChange={(e) => {
                setFieldValue('chapterContent', e.target.value)
                setFieldValue(
                  'wordCount',
                  e.target.value.trim().split(/\s+/).length
                )
              }}
              value={values.chapterContent}
              name="chapterContent"
            />
          </div>
          {errors.chapterContent && Boolean(touched.chapterContent) && (
            <span className="text-red-500">{errors.chapterContent}</span>
          )}
        </div>
        <div className="rounded-lg border border-blue-300 px-2 py-1">
          <p>Wordcount: {values.wordCount}</p>
        </div>
      </div>
      <input
        className="cursor-pointer rounded-lg bg-blue-500 px-2 py-1 text-lg text-white hover:bg-blue-600 hover:text-gray-100"
        type="submit"
        disabled={isLoading ? true : false}
      />

      {/* Error */}
      <div
        className={`${Error.length > 0 ? 'mt-3 rounded-lg border border-red-700 bg-red-300 p-2 text-black' : ''}`}
      >
        {Error && (
          <p className="text-center font-semibold text-black">{Error}</p>
        )}
      </div>
    </form>
  )
}

export default ChapterForm
