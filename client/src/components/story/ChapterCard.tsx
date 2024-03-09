'use client'

import { useAppSelector } from '@/lib/redux/store'
import { ChapterI, StoryI } from '@/typings'
import axios from 'axios'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

function ChapterCard({
  chapter,
  reset,
  story,
}: {
  chapter: ChapterI
  reset: any
  story: StoryI
}) {
  const user = useAppSelector((state) => state.auth.user)
  const token = useAppSelector((state) => state.auth.token)

  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false)

  const router = useRouter()

  const deleteChapter = async () => {
    await axios.delete(
      `http://localhost:8080/api/v1/chapter/delete/${chapter._id}`,
      {
        headers: {
          Authorization: 'Bearer ' + token,
        },
      }
    )
    reset(chapter.storyId._id)
    setConfirmDeleteOpen(false)
  }

  return (
    <div className="flex w-full gap-1">
      <Link
        className="w-full"
        href={`/story/${chapter.storyId._id}/${chapter.storyId.slug}/${chapter.chapterNumber}`}
      >
        <div className="flex justify-between border border-gray-200">
          {/* Chapter Number & Title */}
          <div className="flex items-center gap-2">
            <div className="flex h-20 w-20 items-center justify-center bg-gray-100">
              <h1 className="text-7xl text-gray-400">
                {chapter.chapterNumber}
              </h1>
            </div>
            <div className="text-xl">{chapter.name}</div>
          </div>

          {/* Date Created, Likes, Like Button */}
          <div className="flex items-center gap-3 p-4">
            {/*@ts-ignore*/}
            <p className="text-gray-500">{chapter.createdAt}</p>

            <div className="flex gap-1">
              {/* Heart */}
              <p className="text-gray-500">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="icon icon-tabler icon-tabler-heart"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                  <path d="M19.5 12.572l-7.5 7.428l-7.5 -7.428a5 5 0 1 1 7.5 -6.566a5 5 0 1 1 7.5 6.572" />
                </svg>
              </p>

              {/* Likes */}
              <p className="text-gray-500">
                {chapter.likes
                  ? Object.keys(chapter.likes).length.toLocaleString('en-US')
                  : 0}
              </p>
            </div>
          </div>
        </div>
      </Link>

      <div className="relative flex items-center gap-1 text-white">
        {(chapter.userId === user._id ||
          (story.editorId === user._id &&
            story.editorRequestStatus === 'Accepted')) && (
          <button
            className="size-20 border border-gray-500 bg-blue-500 hover:bg-blue-600"
            onClick={() =>
              router.push(
                `/story/${chapter.storyId._id}/${chapter.storyId.slug}/update/${chapter.chapterNumber}`
              )
            }
          >
            Edit
          </button>
        )}
        {chapter.userId === user._id && (
          <>
            <button
              className="size-20 border border-gray-500 bg-red-500 hover:bg-red-600"
              onClick={() => setConfirmDeleteOpen(!confirmDeleteOpen)}
            >
              Delete
            </button>

            {confirmDeleteOpen && (
              <div className="fixed bottom-0 left-0 right-0 top-0 flex h-full w-full flex-col items-center justify-center gap-3 bg-black bg-opacity-70">
                <p>Do you want to delete this chapter?</p>
                <div className="flex gap-3">
                  <button
                    className="w-52 border border-gray-600 bg-red-500 py-2 hover:bg-red-600"
                    onClick={deleteChapter}
                  >
                    Yes
                  </button>
                  <button
                    className="w-52 border border-gray-600 bg-blue-500 py-2 hover:bg-blue-600"
                    onClick={() => setConfirmDeleteOpen(false)}
                  >
                    No
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default ChapterCard
