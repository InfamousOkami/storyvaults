'use client'

import axios from 'axios'
import { useEffect, useState } from 'react'
import SimpleCard from '../card/storyCards/SimpleCard'
import { StoryI } from '@/typings'
import LoadingPulse from '../loading/LoadingSpinner'

function VaultStory({ storyId }: { storyId: string }) {
  const [story, setStory] = useState<StoryI | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const getStory = async (id: string) => {
    const story = await axios.get(`http://localhost:8080/api/v1/stories/${id}`)

    setStory(story.data.data)
    setIsLoading(false)
  }

  useEffect(() => {
    getStory(storyId)
  }, [storyId])

  if (isLoading) return <LoadingPulse />

  return (
    <>
      <SimpleCard story={story!} />
    </>
  )
}

export default VaultStory
