'use client'

import axios from 'axios'
import { useEffect, useState } from 'react'
import LoadingPulse from '../../loading/LoadingSpinner'
import CoverTitleCard from '../CoverTitleCard'
import { StoryI } from '@/typings'
import Top3WeeklyRated from './Top3WeeklyRated'
import Link from 'next/link'

function WeeklyFeatured() {
  const [stories, setStories] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  const getTopThirteen = async () => {
    const stories = await axios.get(
      `http://localhost:8080/api/v1/stories/top/thirteen/all`
    )

    setStories(stories.data.data)
    setIsLoading(false)
  }

  useEffect(() => {
    getTopThirteen()
  }, [])

  if (isLoading) return <LoadingPulse />

  return (
    <div className="my-5 w-full">
      <div className="flex w-full flex-col items-center">
        <p className="mx-auto mb-1 w-full text-center text-xl font-bold text-gray-800">
          Weekly Featured
        </p>
        <div className="flex flex-col items-center justify-between gap-5 lg:w-[1030px] min-[1165px]:flex-row">
          {/* Top 3 weekly Rated */}
          <div className="h-[427px] w-[415px] overflow-hidden rounded-md bg-white">
            <Top3WeeklyRated stories={stories.slice(0, 3)} />
          </div>

          {/* Top 10 After Top 3 */}
          <div className="flex w-full max-w-[625px] flex-row flex-wrap justify-center gap-5 rounded-md bg-white py-2 ">
            {stories
              .filter((_, i) => {
                return i > 2
              })
              .map((story: StoryI) => (
                <Link
                  key={story._id}
                  href={`/story/${story._id}/${story.slug}`}
                >
                  <CoverTitleCard story={story} />
                </Link>
              ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default WeeklyFeatured
