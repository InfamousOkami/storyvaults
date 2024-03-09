'use client'

import DetailedCard from '@/components/card/storyCards/DetailedCard'
import LoadingPulse from '@/components/loading/LoadingSpinner'
import { StoryI } from '@/typings'
import axios from 'axios'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'

// TODO: Add Bookmark Updating current chapter
// TODO: Update story views

function StoryPage() {
  const params = useParams()

  const [story, setStory] = useState<StoryI | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const getStory = async (id: string) => {
    const story = await axios.get(`http://localhost:8080/api/v1/stories/${id}`)

    setStory(story.data.data)
    setIsLoading(false)
  }

  useEffect(() => {
    getStory(params.id as string)
  }, [params.id])

  if (isLoading) return <LoadingPulse />

  return (
    <div className="p-2">
      <DetailedCard story={story!} />
    </div>
  )
}

export default StoryPage
