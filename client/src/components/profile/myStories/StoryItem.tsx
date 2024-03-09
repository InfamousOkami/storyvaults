'use client'

import { StoryContext } from '@/lib/StoryProvider'
import { useAppSelector } from '@/lib/redux/store'
import { StoryI } from '@/typings'
import axios from 'axios'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useContext, useState } from 'react'

function StoryItem({ story, refresh }: { story: StoryI; refresh: any }) {
  const token = useAppSelector((state) => state.auth.token)

  const [isActive, setisActive] = useState(story.active)
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false)

  const router = useRouter()

  const toggleDeactivate = async () => {
    await axios.patch(
      `http://localhost:8080/api/v1/stories/deactivate/${story._id}`,
      {},
      {
        headers: {
          Authorization: 'Bearer ' + token,
        },
      }
    )

    if (isActive) {
      setisActive(false)
    } else {
      setisActive(true)
    }

    refresh()
  }

  const deleteStory = async () => {
    await axios.delete(
      `http://localhost:8080/api/v1/stories/delete/${story._id}`,
      {
        headers: {
          Authorization: 'Bearer ' + token,
        },
      }
    )

    refresh()
  }

  return (
    <div className="flex w-full gap-1 border-x border-gray-300 min-[850px]:w-[500px]">
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
            onClick={() => router.push(`/story/${story._id}/update/`)}
          >
            Edit
          </button>

          <button
            className=" bg-orange-500 px-2  py-1 text-white hover:bg-orange-600"
            onClick={toggleDeactivate}
          >
            Deactivate
          </button>

          <div className="relative">
            <button
              className=" w-full bg-red-500 px-2 py-1  text-white hover:bg-red-600"
              onClick={() => setConfirmDeleteOpen(!confirmDeleteOpen)}
            >
              Delete
            </button>

            {/* Confirm Buttons */}
            <div
              className={`absolute left-[-98px] top-[-1px] flex flex-col border border-r-0 border-gray-800 ${confirmDeleteOpen ? '' : 'hidden'}`}
            >
              <button
                className="w-24 bg-red-500  py-1 text-white hover:bg-red-600"
                onClick={deleteStory}
              >
                Yes
              </button>
              <button
                className="w-24 bg-green-500  py-1 text-white hover:bg-green-600"
                onClick={() => setConfirmDeleteOpen(false)}
              >
                No
              </button>
            </div>
          </div>

          <div
            className={`py-1 text-center text-white ${isActive ? 'bg-green-500' : 'bg-yellow-500'}`}
          >
            {isActive ? <p> Active</p> : <p> Deactive</p>}
          </div>
        </div>
      </div>
    </div>
  )
}

export default StoryItem
