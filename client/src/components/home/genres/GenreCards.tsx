'use client'

import NewBadge from '@/components/badges/NewBadge'
import UpdatedBadge from '@/components/badges/UpdatedBadge'
import { StoryI } from '@/typings'
import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'

function GenreCards({ story, bgColor }: { story: StoryI; bgColor: string }) {
  const [active, setActive] = useState(false)
  const [isNew, setIsNew] = useState(false)
  const [isUpdated, setIsUpdated] = useState(false)

  const parseRelativeTime = (relativeTime: any) => {
    // const match = relativeTime.match(/(\d+) ( Minute| Hour| Day)s? Ago/)
    const match = relativeTime.split(' ')
    if (match) {
      const amount = parseInt(match[0])
      const unit = match[1] + ' ' + match[2]
      const currentDate = new Date()
      switch (unit) {
        case 'Minutes Ago':
          currentDate.setMinutes(currentDate.getMinutes() - amount)
          break
        case 'Hours Ago':
          currentDate.setHours(currentDate.getHours() - amount)
          break
        case 'Days Ago':
          currentDate.setDate(currentDate.getDate() - amount)
          break
        default:
          return null
      }
      return currentDate
    }
    return null
  }

  const isNewStory = () => {
    const createdAt = parseRelativeTime(story.createdAt)
    if (!createdAt) {
      return false // Unable to parse createdAt, assume it's not new
    }
    const differenceInDays =
      (Date.now() - createdAt.getTime()) / (1000 * 3600 * 24)
    return differenceInDays <= 7
  }

  const isUpdatedStory = () => {
    const createdAt = parseRelativeTime(story.updatedAt)
    if (!createdAt) {
      return false // Unable to parse createdAt, assume it's not new
    }
    const differenceInDays =
      (Date.now() - createdAt.getTime()) / (1000 * 3600 * 24)
    return differenceInDays <= 7
  }

  useEffect(() => {
    if (isNewStory()) setIsNew(true)
    if (isUpdatedStory()) setIsUpdated(true)
  }, [])

  return (
    <Link
      href={`/story/${story._id}/${story.slug}`}
      onMouseEnter={() => setActive(true)}
      onMouseLeave={() => setActive(false)}
    >
      <div
        className={`relative size-[100px] justify-center rounded-md border border-gray-300 p-2 md:size-[150px] min-[1160px]:size-[250px] ${active ? bgColor.split(' ')[0] + ' space-y-2 divide-y-2' : 'bg-white'}`}
      >
        <div>
          <h1
            className={`line-clamp-2 text-xs font-semibold leading-6 text-gray-800 hover:underline  md:text-lg ${active ? 'text-white' : ''}`}
          >
            {story.title}
          </h1>
          <p className={`text-white ${active ? '' : 'hidden'}`}>
            <span>By: </span> {story.userId.username}
          </p>

          <p className={`flex items-center gap-1 ${active ? 'hidden' : ''}`}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="icon icon-tabler icon-tabler-heart-filled cursor-pointer text-red-600 hover:text-red-700"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path
                d="M6.979 3.074a6 6 0 0 1 4.988 1.425l.037 .033l.034 -.03a6 6 0 0 1 4.733 -1.44l.246 .036a6 6 0 0 1 3.364 10.008l-.18 .185l-.048 .041l-7.45 7.379a1 1 0 0 1 -1.313 .082l-.094 -.082l-7.493 -7.422a6 6 0 0 1 3.176 -10.215z"
                strokeWidth="0"
                fill="currentColor"
              />
            </svg>
            <span>{story.favoriteAmount.total}</span>
          </p>
        </div>
        <div className={`${active ? '' : ' hidden'}`}>
          <p className="line-clamp-4 text-white">{story.description}</p>
        </div>

        <div
          className={`absolute bottom-1 left-1 flex h-fit w-fit scale-75 md:scale-100 ${active ? 'hidden' : ''}`}
        >
          <NewBadge active={isNew} size="48" />
          <UpdatedBadge active={isUpdated} size="48" />
        </div>

        <div
          className={`absolute bottom-1 right-1  hidden w-[35%] overflow-hidden  ${active ? 'hidden' : 'md:block'}`}
        >
          <Image
            height={5000}
            width={5000}
            placeholder="empty"
            priority={true}
            src={`http://localhost:8080/assets/${story.userId.username}/${story.picturePath}`}
            alt={story.picturePath ? story.picturePath : story.title}
          />
        </div>
      </div>
    </Link>
  )
}

export default GenreCards
