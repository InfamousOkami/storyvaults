'use client'

import { StoryI } from '@/typings'
import StoryImage from './StoryImage'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

function Top3WeeklyRated({ stories }: { stories: StoryI[] }) {
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % stories.length)
    }, 7000) // Change slide every 10 seconds

    return () => clearInterval(interval)
  }, [stories.length])

  return (
    <>
      <div className="relative h-[45%] w-full overflow-hidden">
        <div className="absolute bottom-0 left-0 right-0 top-0 z-30 flex justify-center gap-2 p-5">
          {/* 3 Pics */}
          {stories.map((story: StoryI, i) => (
            <div
              key={story._id}
              className={`transition-all ${i === activeIndex ? 'scale-[1.15]  ' : ''}`}
              onClick={() => setActiveIndex(i)}
            >
              <StoryImage
                username={story.userId.username}
                imageLink={
                  story.picturePath ? story.picturePath : story.userId.username
                }
              />
            </div>
          ))}
        </div>

        {/* Bg Image */}
        <div className="relative h-full w-full blur-[2px]">
          {stories.map((story: StoryI, i) => (
            <div
              key={story._id}
              className={`relative h-full w-full ${i === activeIndex ? 'block  ' : 'hidden'}`}
            >
              <Image
                className="absolute top-[-100px] w-full"
                priority
                placeholder="empty"
                width={5000}
                height={5000}
                alt={story.userId.username}
                src={`http://localhost:8080/assets/${story.userId.username}/${story.picturePath}`}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Info */}
      <div className="text-center">
        {stories.map((story: StoryI, i) => (
          <div
            key={'desc' + story._id}
            className={`${activeIndex === i ? 'block' : 'hidden'}`}
          >
            <Link
              href={`/story/${story._id}/${story.slug}`}
              className="text-lg font-semibold text-gray-800 hover:text-blue-600 hover:underline"
            >
              {story.title}
            </Link>
            <p className="text-gray-500">
              {story.genre.name} -{' '}
              <span className="text-gray-800 hover:text-blue-600">
                <Link href={`profile/${story.userId.username}`}>
                  {story.userId.username}
                </Link>
              </span>
            </p>
            <p className="line-clamp-[7] text-gray-500">{story.description}</p>
          </div>
        ))}
      </div>
    </>
  )
}

export default Top3WeeklyRated
