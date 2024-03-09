'use client'

import { useAppSelector } from '@/lib/redux/store'
import axios from 'axios'
import { useContext, useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { VaultI } from '@/typings'
import LoadingPulse from '../loading/LoadingSpinner'
import Dropzone from 'react-dropzone'
import * as yup from 'yup'
import { useFormik } from 'formik'
import { v4 as uuidv4 } from 'uuid'
import { VaultContext } from '@/lib/VaultProvider'

function VaultForm({ type }: { type: string }) {
  const user = useAppSelector((state) => state.auth.user)
  const token = useAppSelector((state) => state.auth.token)

  const { vaults, SetVaults } = useContext(VaultContext)

  const resetVaults = async () => {
    const vaults = await axios.get(
      `http://localhost:8080/api/v1/vault/user/followed`,
      {
        headers: {
          Authorization: 'Bearer ' + token,
        },
      }
    )

    SetVaults(vaults.data.data)
  }

  const params = useParams()
  const router = useRouter()

  const [isLoading, setIsLoading] = useState(false)

  const [vault, setVault] = useState<VaultI | null>(null)
  const [Error, setError] = useState<string>('')

  const getVault = async (id: string) => {
    const vault = await axios.get(`http://localhost:8080/api/v1/vault/${id}`)

    setVault(vault.data.data)

    setFieldValue('name', vault.data.data.name)
    setFieldValue('description', vault.data.data.description)
    if (vault.data.data.pictureName) {
      setFieldValue('pictureName', vault.data.data.pictureName)
      setFieldValue('picturePath', vault.data.data.picturePath)
    }

    setIsLoading(false)
  }

  const VaultSchema = yup.object().shape({
    name: yup
      .string()
      .required('Must have a title')
      .max(100, 'Must be under 100 characters'),
    description: yup.string().required('Must have a description'),
  })

  // Gets vault when type == update
  useEffect(() => {
    if (type == 'update') {
      setIsLoading(true)
      getVault(params.id as string)
    }
  }, [params.id, type]) // eslint-disable-line

  // Set default values when vault is available
  let initialValues = {
    name: '',
    description: '',
    picturePath: '',
    pictureName: '',
  }

  const formik = useFormik({
    initialValues: initialValues,

    validationSchema: VaultSchema,

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
          const vault = await axios.post(
            `http://localhost:8080/api/v1/vault/new`,
            formData,
            {
              headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: 'Bearer ' + token,
              },
            }
          )

          const newVault = vault.data.data

          SetVaults([newVault, ...vaults])
        } catch (error: any) {
          setError(error.response.data.message)
        }
      } else if (type === 'update') {
        try {
          await axios.patch(
            `http://localhost:8080/api/v1/vault/update/${params.id}`,
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

        setIsLoading(false)
        resetVaults()
      }
      setIsLoading(false)
      router.push('/profile/myVaults')
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
  if ((vault && user!._id !== vault?.userId._id) || !token)
    return <p className="p-10 text-center text-3xl">Access Denied</p>

  return (
    <form
      onSubmit={handleSubmit}
      className="container m-auto flex max-w-[900px] flex-col items-center py-5"
    >
      <h1 className="text-2xl font-semibold text-gray-700">
        {type === 'new' ? 'Create A Vault!' : `Update ${values.name}`}
      </h1>
      <div className="flex w-full flex-col items-center gap-2 p-2 ">
        {/* Name */}
        <div className="flex w-full flex-col items-center">
          <div className="flex w-full flex-col">
            <label className=" ">Title: </label>
            <input
              className={`w-full basis-[85%] rounded-lg border border-gray-300 p-1 ${errors.name && Boolean(touched.name) ? 'border-4 border-red-500' : ''}`}
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

        {/* Description */}
        <div className="flex w-full flex-col items-center">
          <div className="flex w-full flex-col">
            <label className="">Description:</label>
            <textarea
              className={`w-full basis-[85%] rounded-lg border border-gray-300 p-1 ${errors.description && Boolean(touched.description) ? 'border-4 border-red-500 ' : ''}`}
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
    </form>
  )
}

export default VaultForm
