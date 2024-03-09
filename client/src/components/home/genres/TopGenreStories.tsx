'use client'

import axios from 'axios'
import { useEffect, useState } from 'react'

import { GenreI, StoryI } from '@/typings'
import LoadingPulse from '../../loading/LoadingSpinner'
import Link from 'next/link'
import GenreCards from './GenreCards'

const getGenreColor = (type: string) => {
  switch (type) {
    case 'Action':
      return 'bg-blue-500 hover:bg-blue-600'

    case 'Adventure':
      return 'bg-green-500 hover:bg-green-600'

    default:
      return 'bg-blue-400'
  }
}

function TopGenreStories({ genre }: { genre: string }) {
  const [stories, setStories] = useState([])
  const [genreO, setGenre] = useState<GenreI | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const getTopGenreStories = async (genreId: string) => {
    const data = await axios.get(
      `http://localhost:8080/api/v1/stories/top/genre/${genreId}`
    )
    setStories(data.data.data)
  }

  const getGenre = async (genreId: string) => {
    const data = await axios.get(
      `http://localhost:8080/api/v1/genre/${genreId}`
    )
    setGenre(data.data.data)
  }

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      await Promise.all([getGenre(genre), getTopGenreStories(genre)])
      setIsLoading(false)
    }
    fetchData()
  }, [genre])

  if (isLoading) return <LoadingPulse />

  return (
    <div className="flex w-full justify-center rounded-lg bg-gray-50">
      <div className="relative w-full px-1 md:w-fit">
        <div
          className={`my-2 flex w-full ${stories.length < 3 ? 'justify-start' : 'justify-center'} gap-2`}
        >
          <Link href={`/stories?genre=${genre}`}>
            <div
              className={`relative flex size-[100px] items-center justify-center rounded-md border border-gray-500 md:size-[150px] min-[1160px]:size-[250px] ${genreO ? getGenreColor(genreO!.name) : ''}`}
            >
              <h1
                className={`bg absolute left-3 top-3 text-xs font-semibold text-white md:text-xl`}
              >
                {genreO?.name}
              </h1>

              <p
                className={`bg absolute bottom-2 text-[8px] font-semibold  text-white sm:text-base`}
              >
                Click To See More
              </p>
            </div>
          </Link>
          {stories.length === 0 && (
            <>
              <div
                className={`relative flex size-[100px] items-center justify-center rounded-md border border-gray-200 bg-gray-100 md:size-[150px] min-[1160px]:size-[250px]`}
              >
                <p className=" text-xl font-bold text-gray-800">
                  No Current Stories
                </p>
              </div>
              <div
                className={`relative flex size-[100px] items-center justify-center rounded-md border border-gray-200 bg-gray-100 md:size-[150px] min-[1160px]:size-[250px]`}
              ></div>
              <div
                className={`relative flex size-[100px] items-center justify-center rounded-md border border-gray-200 bg-gray-100 md:size-[150px] min-[1160px]:size-[250px]`}
              ></div>
            </>
          )}
          {stories.map((story: StoryI) => (
            <GenreCards
              key={story._id}
              story={story}
              bgColor={getGenreColor(story.genre.name)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default TopGenreStories
