'use client'

import { useAppSelector } from '@/lib/redux/store'
import { StoryI } from '@/typings'
import axios from 'axios'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'

function EditorStoryItem({ story, refresh }: { story: StoryI; refresh: any }) {
  const token = useAppSelector((state) => state.auth.token)

  const [confirmRemoveOpen, setConfirmRemoveOpen] = useState(false)

  const router = useRouter()

  const removeEditorStory = async () => {
    await axios.patch(
      `http://localhost:8080/api/v1/stories/editor/update/${story._id}`,
      { editorRequestStatus: 'None' },
      {
        headers: {
          Authorization: 'Bearer ' + token,
        },
      }
    )

    refresh()
  }

  return (
    <div className="flex w-full gap-1 border-x border-gray-300 ">
      {/* Image */}
      <div className="">
        <Link href={`/story/${story._id}/${story.slug}`}>
          <div className="h-30 w-24 cursor-pointer overflow-hidden ">
            <Image
              width={500}
              height={500}
              placeholder="empty"
              priority={true}
              src={`http://localhost:8080/assets/${story.userId.username}/${story.picturePath}`}
              alt={story.picturePath ? story.picturePath : story.title}
            />
          </div>
        </Link>
      </div>

      {/* Info */}
      <div className="flex w-full justify-between">
        <div className="flex flex-col justify-between">
          <Link href={`/story/${story._id}/${story.slug}`}>
            <h1 className="text-lg font-bold hover:text-blue-600">
              {story.title}
            </h1>
          </Link>
          <p>Chapters {story.chapterAmount}</p>
        </div>

        {/* Buttons */}
        <div className=" flex h-fit flex-col border-b border-l border-gray-600">
          <button
            className=" bg-blue-500 px-2 py-1 text-white  hover:bg-blue-600"
            onClick={() => router.push(`/story/${story._id}/${story.slug}`)}
          >
            Edit
          </button>

          <div className="relative">
            <button
              className=" w-full bg-red-500 px-2 py-1  text-white hover:bg-red-600"
              onClick={() => setConfirmRemoveOpen(!confirmRemoveOpen)}
            >
              Delete
            </button>

            {/* Confirm Buttons */}
            <div
              className={`absolute left-[-98px] top-[-1px] flex flex-col border border-r-0 border-gray-800 ${confirmRemoveOpen ? '' : 'hidden'}`}
            >
              <button
                className="w-24 bg-red-500  py-1 text-white hover:bg-red-600"
                onClick={removeEditorStory}
              >
                Yes
              </button>
              <button
                className="w-24 bg-green-500  py-1 text-white hover:bg-green-600"
                onClick={() => setConfirmRemoveOpen(false)}
              >
                No
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EditorStoryItem
