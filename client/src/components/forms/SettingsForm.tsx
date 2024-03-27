'use client'

import { AppDispatch, useAppSelector } from '@/lib/redux/store'
import { LanguageI, UserI } from '@/typings'
import axios from 'axios'
import { useFormik } from 'formik'
import React, { useEffect, useState } from 'react'
import * as yup from 'yup'
import LoadingPulse from '../loading/LoadingSpinner'
import WangTextEditror from './WangTextEditror'
import { setUserSettings } from '@/lib/redux/features/auth-slice'
import { useDispatch } from 'react-redux'
import Dropzone from 'react-dropzone'
import { v4 as uuidv4 } from 'uuid'
import Image from 'next/image'

// TODO: Add external Links, tosAccept, and theme to settings

function SettingsForm() {
  const user = useAppSelector((state) => state.auth.user)
  const token = useAppSelector((state) => state.auth.token)
  const dispatch = useDispatch<AppDispatch>()

  const [isLoading, setIsLoading] = useState(false)
  const [languages, setLanguages] = useState([])

  const [Error, setError] = useState<string>('')

  const [html, setHtml] = useState(user.bio)
  const [contentText, setContentText] = useState('')

  const getLanguages = async () => {
    const languages = await axios.get(`http://localhost:8080/api/v1/language`)

    setLanguages(languages.data.data)
  }

  useEffect(() => {
    setFieldValue('bio', html)
  }, [html])

  useEffect(() => {
    getLanguages()
  }, [])

  const UserSchema = yup.object().shape({
    bio: yup.string(),
    role: yup.string().required('Role is required'),
    language: yup.string().required('Language is required'),
    theme: yup.string(),
    adultContent: yup.boolean(),
    tosAccepted: yup.boolean(),
    externalLinks: yup.array().of(
      yup.object().shape({
        type: yup.string().required('Need a type of link'),
        href: yup.string().required('Need a link'),
      })
    ),
  })

  // Set default values when story is available
  let initialValues = {
    bio: user.bio,
    role: user.role,
    language: user.language,
    theme: user.theme,
    adultContent: user.adultContent,
    tosAccepted: user.tosAccepted,
    picturePath: user.picturePath,
  }

  const formik = useFormik({
    initialValues: initialValues,

    validationSchema: UserSchema,

    // Handle form submission
    onSubmit: async (values: any, onSubmitProps: any) => {
      setIsLoading(true)

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

      try {
        const newUserSettings = await axios.patch(
          `http://localhost:8080/api/v1/users/updateMe/`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
              Authorization: 'Bearer ' + token,
            },
          }
        )

        const updatedUser = newUserSettings.data.data

        dispatch(setUserSettings({ user: updatedUser }))
      } catch (error: any) {
        setError(error.response.data.message)
      }

      setIsLoading(false)
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

  if (!token) return <p className="p-10 text-center text-3xl">Access Denied</p>

  return (
    <form
      onSubmit={handleSubmit}
      className="container m-auto  flex flex-col items-center py-5"
    >
      <div className="flex w-full flex-col items-center justify-center gap-2 p-2 md:flex-row md:flex-wrap">
        {/* Role & Language */}
        <div className="flex w-full gap-5">
          {/* Role */}
          <div className="flex w-full flex-col items-center">
            <div className="flex w-full flex-col">
              <label className="text-center text-lg font-semibold">Role</label>
              <select
                className="rounded-lg border border-gray-300 p-1"
                id="role"
                onChange={(e) => {
                  setFieldValue('role', e.target.value)
                  if (e.target.value === 'free') setFieldValue('price', '0.00')
                }}
                value={values.role}
                name="role"
              >
                <option value="Reader">Reader</option>
                <option
                  disabled={values.tosAccepted ? false : true}
                  value="Writer"
                >
                  Writer
                </option>
                <option
                  disabled={values.tosAccepted ? false : true}
                  value="Editor"
                >
                  Editor
                </option>
                {user._id === '65baf5a9ed2da779156630ac' && (
                  <>
                    <option
                      disabled={
                        user._id === '65baf5a9ed2da779156630ac' ? false : true
                      }
                      value="Admin"
                    >
                      Admin
                    </option>
                    <option
                      disabled={
                        user._id === '65baf5a9ed2da779156630ac' ? false : true
                      }
                      value="Owner"
                    >
                      Owner
                    </option>
                  </>
                )}
              </select>
            </div>
            {errors.bio && Boolean(touched.bio) && (
              <span className="text-red-500">{errors.bio}</span>
            )}
          </div>
          {/* Language */}
          <div className="flex w-full flex-col">
            <div className="flex w-full flex-col">
              <label className="text-center text-lg font-semibold">
                Language
              </label>
              <select
                className="w-full rounded-lg border border-gray-300 p-1"
                id="language"
                onChange={(e) => {
                  setFieldValue('language', e.target.value)
                  if (e.target.value === 'free') setFieldValue('price', '0.00')
                }}
                value={values.language}
                name="language"
              >
                {languages!.map((language: LanguageI) => (
                  <option key={language._id} value={language._id}>
                    {language.name}
                  </option>
                ))}
              </select>
            </div>
            {errors.language && Boolean(touched.language) && (
              <span className="text-red-500">{errors.language}</span>
            )}
          </div>
        </div>
        {/* adultContent & Image */}
        <div className="flex w-full gap-2">
          {/* Image */}
          <div className="flex w-full gap-2">
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
                      <p>{values.picturePath}</p>
                    </div>
                  )}
                </div>
              )}
            </Dropzone>
            <div className="size-32 overflow-hidden">
              <Image
                width={500}
                height={500}
                src={`
                  ${user.picturePath !== 'default.webp' ? `http://localhost:8080/assets/${user.username}/${user.picturePath}` : `http://localhost:8080/assets/${user.picturePath}`}
                  `}
                alt={user.username}
              />
            </div>
          </div>
          {/* adultContent */}
          <div className="flex w-48 flex-col items-center ">
            <label>Adult Content </label>
            <div className="flex w-full justify-center gap-2">
              <label
                htmlFor="true"
                className={`cursor-pointer rounded-lg border border-blue-400 px-2 py-1 ${
                  values.adultContent == true
                    ? 'bg-blue-500 text-white'
                    : 'bg-blue-100 text-gray-600'
                }`}
              >
                Yes
              </label>
              <input
                type="radio"
                id="true"
                onChange={() => setFieldValue('adultContent', true)}
                className="hidden"
                name="adultContent"
                value="true"
              />
              <label
                htmlFor="false"
                className={`cursor-pointer rounded-lg border border-blue-400 px-2 py-1 ${
                  values.adultContent == false
                    ? 'bg-blue-500 text-white'
                    : 'bg-blue-100 text-gray-600'
                }`}
              >
                No
              </label>
              <input
                type="radio"
                id="false"
                onChange={() => setFieldValue('adultContent', false)}
                value="false"
                className="hidden"
                name="adultContent"
              />
            </div>
          </div>
        </div>

        {/* Bio */}
        <div className="flex w-full flex-col items-center">
          <div className="flex w-full flex-col">
            <label className="text-center text-lg font-semibold">Bio</label>
            <WangTextEditror
              html={values.bio}
              setHtml={setHtml}
              setText={setContentText}
            />
          </div>
          {errors.bio && Boolean(touched.bio) && (
            <span className="text-red-500">{errors.bio}</span>
          )}
          <div className="mt-2 rounded-lg border border-blue-300 px-2 py-1">
            <p>Wordcount: {contentText.trim().split(/\s+/).length}</p>
          </div>
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

export default SettingsForm
