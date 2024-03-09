'use client'

import { StoryContext } from '@/lib/StoryProvider'
import { useAppSelector } from '@/lib/redux/store'
import { StoryI } from '@/typings'
import axios from 'axios'
import { useContext } from 'react'
import StoryItem from './StoryItem'

function MyStories() {
  const token = useAppSelector((state) => state.auth.token)
  const user = useAppSelector((state) => state.auth.user)

  const { stories, SetStories } = useContext(StoryContext)

  const refreshStories = async () => {
    const stories = await axios.get(
      `http://localhost:8080/api/v1/stories/user/${user._id}`
    )

    const storyList = stories.data.data
    SetStories(storyList)
  }

  return (
    <div className="flex w-full flex-col items-center divide-y divide-gray-500">
      <div onClick={refreshStories} className="w-full min-[850px]:w-[500px]">
        <p className="w-full cursor-pointer bg-blue-500 py-1 text-center text-white hover:bg-blue-600">
          Refresh
        </p>
      </div>
      {stories.length === 0 && (
        <div>
          <p className="p-3 text-center text-2xl font-semibold text-gray-800">
            No Stories
          </p>
        </div>
      )}
      {stories.map((story: StoryI) => (
        <StoryItem key={story._id} story={story} refresh={refreshStories} />
      ))}
    </div>
  )
}

export default MyStories
