'use client'

import axios from 'axios'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import LoadingPulse from '../loading/LoadingSpinner'
import { ChapterI, StoryI } from '@/typings'
import DetailedCard from '../card/storyCards/DetailedCard'

// TODO: Update chapter views

function ChapterContent() {
  const params = useParams()

  const [chapter, setChapter] = useState<ChapterI | null>(null)
  const [storyO, setStory] = useState<StoryI | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const getchapters = async (storyId: string, chapterNum: number) => {
    const chapter = await axios.get(
      `http://localhost:8080/api/v1/chapter/${storyId}/${chapterNum}`
    )

    setChapter(chapter.data.data)
  }

  const getStory = async (storyId: string) => {
    const story = await axios.get(
      `http://localhost:8080/api/v1/stories/${storyId}`
    )

    setStory(story.data.data)
  }

  useEffect(() => {
    getStory(params.id as string)
    getchapters(params.id as string, Number(params.chapterNumber as string))
    setIsLoading(false)
  }, [params.id, params.chapterNumber])

  if (isLoading) return <LoadingPulse />
  // TODO: Add Like Functionality to chapter

  return (
    <div className=" flex flex-col gap-2">
      {storyO && (
        <div className="hidden lg:block">
          <DetailedCard story={storyO} />
        </div>
      )}
      <div className=" m-1 rounded-lg bg-gray-100 p-2">
        <p className="text-center text-4xl font-bold text-gray-700">
          {chapter?.name}
        </p>
        <p className="text-lg">{chapter?.chapterContent}</p>
      </div>
    </div>
  )
}

export default ChapterContent
