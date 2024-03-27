'use client'

import axios from 'axios'
import * as yup from 'yup'
import { useFormik } from 'formik'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

function SignUpForm() {
  const router = useRouter()

  const [Errors, setErrors] = useState<string>('')
  const UserSignUpSchema = yup.object().shape({
    username: yup
      .string()
      .required('Username required')
      .max(25, 'Must be under 25 characters'),
    email: yup.string().required('Email is required'),
    password: yup.string().required('Password is required'),
    passwordConfirm: yup.string().required('Password Confirm is required'),
  })

  // Set default values when story is available
  let initialValues = {
    username: '',
    email: '',
    password: '',
    passwordConfirm: '',
  }

  const formik = useFormik({
    initialValues: initialValues,

    validationSchema: UserSignUpSchema,

    // Handle form submission
    onSubmit: async (values: any, onSubmitProps: any) => {
      try {
        console.log('User: ')
        console.log(values)

        const formData = new FormData()
        for (let value in values) {
          formData.append(value, values[value])
        }

        await axios.post(
          `http://localhost:8080/api/v1/auth/register`,
          formData,
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        )
      } catch (error: any) {
        setErrors(error.response.data.message)
      }
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

  return (
    <form
      onSubmit={handleSubmit}
      className="container mx-auto flex max-w-[500px] flex-col gap-3 p-1"
    >
      <div className="flex w-full flex-col items-center gap-2">
        <h1 className="text-2xl font-semibold text-gray-700">Register</h1>
        {/* Username */}
        <div className="flex w-full flex-col items-center">
          <div className="flex w-full flex-col">
            <label>Username: </label>
            <input
              className={`w-full rounded-lg border border-gray-300 p-1 ${errors.username && Boolean(touched.username) ? 'border-4 border-red-500' : ''}`}
              id="username"
              type="text"
              onChange={handleChange}
              value={values.username}
              name="username"
            />
          </div>
          {errors.username && Boolean(touched.username) && (
            <span className="text-red-500">{errors.username}</span>
          )}
        </div>

        {/* Email */}
        <div className="flex w-full flex-col items-center">
          <div className="flex w-full flex-col">
            <label>Email: </label>
            <input
              className={`w-full rounded-lg border border-gray-300 p-1 ${errors.email && Boolean(touched.email) ? 'border-4 border-red-500' : ''}`}
              id="email"
              type="text"
              onChange={handleChange}
              value={values.email}
              name="email"
            />
          </div>
          {errors.email && Boolean(touched.email) && (
            <span className="text-red-500">{errors.email}</span>
          )}
        </div>

        {/* Password */}
        <div className="flex w-full flex-col items-center">
          <div className="flex w-full flex-col">
            <label>Password: </label>
            <input
              className={`w-full rounded-lg border border-gray-300 p-1 ${errors.password && Boolean(touched.password) ? 'border-4 border-red-500' : ''}`}
              id="password"
              type="text"
              onChange={handleChange}
              value={values.password}
              name="password"
            />
          </div>
          {errors.password && Boolean(touched.password) && (
            <span className="text-red-500">{errors.password}</span>
          )}
        </div>

        {/* Password Confirm */}
        <div className="flex w-full flex-col items-center">
          <div className="flex w-full flex-col">
            <label>Confirm Password: </label>
            <input
              className={`w-full rounded-lg border border-gray-300 p-1 ${errors.passwordConfirm && Boolean(touched.passwordConfirm) ? 'border-4 border-red-500' : ''}`}
              id="passwordConfirm"
              type="text"
              onChange={handleChange}
              value={values.passwordConfirm}
              name="passwordConfirm"
            />
          </div>
          {errors.passwordConfirm && Boolean(touched.passwordConfirm) && (
            <span className="text-red-500">{errors.passwordConfirm}</span>
          )}
        </div>

        {/* Buttons */}
        <div className="space-x-2">
          <input
            className="cursor-pointer rounded-lg bg-blue-500 px-2 py-1 text-lg text-white hover:bg-blue-600 hover:text-gray-100"
            type="submit"
          />
          <button
            className="rounded-lg bg-blue-500 px-2 py-1 text-lg text-white hover:bg-blue-600"
            onClick={() => router.push('/login')}
          >
            Log In
          </button>
        </div>
      </div>

      <div
        className={`${Errors.length > 0 ? 'rounded-lg border border-red-700 bg-red-300 p-2 text-black' : ''}`}
      >
        {Errors && (
          <p className="text-center font-semibold text-black">{Errors}</p>
        )}
      </div>
    </form>
  )
}

export default SignUpForm
