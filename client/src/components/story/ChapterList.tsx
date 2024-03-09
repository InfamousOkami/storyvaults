'use client'

import axios from 'axios'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ChapterI, StoryI } from '@/typings'
import ChapterCard from './ChapterCard'
import { useAppSelector } from '@/lib/redux/store'

function ChapterList() {
  const user = useAppSelector((state) => state.auth.user)

  const params = useParams()
  const router = useRouter()

  const [chapter, setChapters] = useState([])
  const [story, setStory] = useState<StoryI | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const getchapters = async (storyId: string) => {
    setIsLoading(true)
    const chapters = await axios.get(
      `http://localhost:8080/api/v1/chapter/story/${storyId}`
    )

    setChapters(chapters.data.data)
  }

  const getStory = async (id: string) => {
    const story = await axios.get(`http://localhost:8080/api/v1/stories/${id}`)

    setStory(story.data.data)
  }

  useEffect(() => {
    getStory(params.id as string)
    getchapters(params.id as string)
    setIsLoading(false)
  }, [params.id])

  return (
    <div className="p-5">
      {story?.userId._id === user._id && (
        <button
          className="w-full bg-blue-500 py-1 text-white hover:bg-blue-600"
          onClick={() =>
            router.push(`/story/${params.id}/${params.slug}/new-chapter`)
          }
        >
          Create a chapter
        </button>
      )}

      <div className=" flex flex-col gap-1 ">
        {story !== null &&
          chapter.map((chap: ChapterI) => (
            <ChapterCard
              key={chap._id}
              reset={getchapters}
              story={story!}
              chapter={chap}
            />
          ))}
      </div>
    </div>
  )
}

export default ChapterList
