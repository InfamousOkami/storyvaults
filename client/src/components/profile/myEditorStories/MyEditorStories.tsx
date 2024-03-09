'use client'

import { useAppSelector } from '@/lib/redux/store'
import axios from 'axios'
import { useEffect, useState } from 'react'
import EditorStoryItem from './EditorStoryItem'
import { StoryI } from '@/typings'
import EditorStoryRequest from './EditorStoryRequest'

function MyEditorStories() {
  const token = useAppSelector((state) => state.auth.token)
  const user = useAppSelector((state) => state.auth.user)

  const [stories, setStories] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  const getEditorStories = async () => {
    const stories = await axios.get(
      `http://localhost:8080/api/v1/stories/editor`,
      {
        headers: {
          Authorization: 'Bearer ' + token,
        },
      }
    )

    setStories(stories.data.data)
  }

  useEffect(() => {
    getEditorStories()
    setIsLoading(false)
  }, [])

  return (
    <div className="m-auto w-full">
      <h1 className="py-2 text-center text-2xl font-semibold text-gray-800">
        Story Editing
      </h1>
      <div className="m-auto flex max-w-[1024px] flex-col items-center  md:flex-row">
        {/* Requestes */}
        <div className="flex w-full flex-col divide-y divide-gray-400">
          {/* No Requests */}
          <p className="py-2 text-center text-2xl font-semibold text-gray-800">
            Requests
          </p>
          {stories
            .filter((story: StoryI) => story.editorRequestStatus === 'Pending')
            .map((story: StoryI) => (
              <EditorStoryRequest
                key={story._id}
                refresh={getEditorStories}
                story={story}
              />
            ))}
        </div>

        {/* Accepted Stories */}
        <div className="flex w-full flex-col divide-y divide-gray-400">
          {/* No stories */}
          <p className="py-2 text-center text-2xl font-semibold text-gray-800">
            Editing
          </p>
          {stories.length < 1 && (
            <p className="container w-full border border-gray-800 text-center text-2xl font-semibold text-gray-800 lg:max-w-[750px]">
              No Stories To Edit
            </p>
          )}
          {stories
            .filter((story: StoryI) => story.editorRequestStatus === 'Accepted')
            .map((story: StoryI) => (
              <EditorStoryItem
                key={story._id}
                refresh={getEditorStories}
                story={story}
              />
            ))}
        </div>
      </div>
    </div>
  )
}

export default MyEditorStories
