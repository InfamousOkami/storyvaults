'use client'

import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { StoryI } from '@/typings'
import LoadingPulse from '../../loading/LoadingSpinner'
import TopCard from '../TopCard'

function TopStoriesScroller({
  categoryId,
  fieldType,
  time,
}: {
  categoryId: string
  fieldType: 'favoriteAmount' | 'bookmarkAmount' | 'ratingsAverage'
  time: 'weeklyCount' | 'monthlyCount' | 'total'
}) {
  const [stories, setStories] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeIndex, setActiveIndex] = useState(0)

  const getTopStories = async (
    categoryId: string,
    fieldTypeQ: string,
    timeType: string
  ) => {
    const category = await axios.get(
      `http://localhost:8080/api/v1/stories/top/${fieldTypeQ}/${timeType}/${categoryId}`
    )

    setStories(category.data.data)
    setIsLoading(false)
  }

  useEffect(() => {
    getTopStories(categoryId, fieldType, time)
  }, [categoryId, fieldType, time])

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % stories.length)
    }, 7000) // Change slide every 10 seconds

    return () => clearInterval(interval)
  }, [stories.length])

  const handleDotClick = (index: number) => {
    setActiveIndex(index)
  }

  if (isLoading) return <LoadingPulse />

  if (stories.length === 0)
    return (
      <div className="my-2 flex h-72 items-center justify-center  rounded-lg border border-gray-400 bg-black bg-opacity-50 text-white sm:w-[500px] sm:min-w-[500px]">
        <p className="text-2xl font-bold">No Top Stories</p>
      </div>
    )

  return (
    <div className="relative w-full px-1 md:w-fit">
      <div className=" my-2 w-full overflow-hidden rounded-lg border border-gray-500 md:w-[500px] md:min-w-[500px]">
        {stories.map((story: StoryI, index: number) => (
          <TopCard
            key={story._id}
            story={story}
            isActive={index === activeIndex}
          />
        ))}
      </div>
      <div className="absolute bottom-5 left-0 right-0 z-20 flex justify-center gap-1">
        {stories.map((_, index) => (
          <div
            key={index}
            onClick={() => handleDotClick(index)}
            className={`h-[10px] w-[10px] cursor-pointer rounded-full bg-blue-400 bg-opacity-75 hover:bg-blue-400 ${index === activeIndex ? ' bg-blue-600 bg-opacity-100' : ''}`}
          />
        ))}
      </div>
    </div>
  )
}

export default TopStoriesScroller
