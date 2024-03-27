'use client'

import DetailedCard from '@/components/card/storyCards/DetailedCard'
import LoadingPulse from '@/components/loading/LoadingSpinner'
import { useAppSelector } from '@/lib/redux/store'
import { StoryI } from '@/typings'
import axios from 'axios'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'

function StoryPage() {
  const user = useAppSelector((state) => state.auth.user)

  const params = useParams()

  const [story, setStory] = useState<StoryI | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const getStory = async (id: string) => {
    const story = await axios.get(`http://localhost:8080/api/v1/stories/${id}`)

    setStory(story.data.data)
    setIsLoading(false)
  }

  const updateStoryViews = async () => {
    await axios.patch(
      `http://localhost:8080/api/v1/stories/story/views/${params.id}`,
      {}
    )
  }

  useEffect(() => {
    getStory(params.id as string)
  }, [params.id])

  useEffect(() => {
    if (story && story.userId._id !== user._id) {
      setTimeout(() => {
        updateStoryViews()
      }, 5000)
    }
  }, [story])

  if (isLoading) return <LoadingPulse />

  return (
    <div className="p-2">
      <DetailedCard story={story!} />
    </div>
  )
}

export default StoryPage
