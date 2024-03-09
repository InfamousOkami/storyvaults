'use client'

import { StoryContext } from '@/lib/StoryProvider'
import { VaultContext } from '@/lib/VaultProvider'
import { logIn } from '@/lib/redux/features/auth-slice'
import { AppDispatch } from '@/lib/redux/store'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { useContext, useState } from 'react'
import { useDispatch } from 'react-redux'

function LoginForm() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [Errors, setErrors] = useState<string>('')

  const { vaults, SetVaults } = useContext(VaultContext)
  const { stories, SetStories } = useContext(StoryContext)

  const router = useRouter()
  const dispatch = useDispatch<AppDispatch>()

  const onSubmit = async () => {
    try {
      const userResponse = await axios.post(
        'http://localhost:8080/api/v1/auth/login',
        {
          username: username,
          password: password,
        }
      )

      const user = userResponse.data.data.user
      const token = userResponse.data.token

      const bookmarks = await axios.get(
        `http://localhost:8080/api/v1/bookmark/user/bookmarks`,
        {
          headers: {
            Authorization: 'Bearer ' + token,
          },
        }
      )

      const bookmarkList = bookmarks.data.data

      const vaults = await axios.get(
        `http://localhost:8080/api/v1/vault/user/followed`,
        {
          headers: {
            Authorization: 'Bearer ' + token,
          },
        }
      )

      const stories = await axios.get(
        `http://localhost:8080/api/v1/stories/user/${user._id}?sort=updatedAt`
      )

      const storyList = stories.data.data

      SetStories(storyList)

      SetVaults(vaults.data.data)

      dispatch(logIn({ user, token, bookmarks: bookmarkList }))

      router.push('/')
    } catch (error: any) {
      setErrors(error.response.data.message)
    }
  }
  return (
    <div className="flex flex-col items-center gap-2">
      <h1 className="text-2xl font-semibold text-gray-700">Log In</h1>

      {/* Username */}
      <div className="flex flex-col gap-1">
        <label htmlFor="username">Username</label>
        <input
          type="text"
          name="username"
          id="username"
          value={username}
          className="w-72 rounded-lg border-2 border-gray-800"
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>

      {/* Password */}
      <div className="flex flex-col gap-1">
        <label htmlFor="password">Password</label>
        <input
          type="text"
          name="password"
          id="password"
          value={password}
          className="w-72 rounded-lg border-2 border-gray-800"
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      {/* Buttons */}
      <div className="space-x-2 ">
        <button
          className="rounded-lg bg-blue-500 px-2 py-1 text-lg text-white hover:bg-blue-600"
          onClick={onSubmit}
        >
          Log In
        </button>
        <button
          className="rounded-lg bg-blue-500 px-2 py-1 text-lg text-white hover:bg-blue-600"
          onClick={() => router.push('/signup')}
        >
          Sign Up
        </button>
      </div>

      {/* Error */}
      <div
        className={`${Errors.length > 0 ? 'mb-3 rounded-lg border border-red-700 bg-red-300 p-2 text-black' : ''}`}
      >
        {Errors && (
          <p className="text-center font-semibold text-black">{Errors}</p>
        )}
      </div>
    </div>
  )
}

export default LoginForm
