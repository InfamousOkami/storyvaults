'use client'

import { StoryI } from '@/typings'
import React, { useEffect } from 'react'

export const StoryContext = React.createContext<{
  stories: StoryI[]
  SetStories: (stories: StoryI[]) => void
}>({
  stories: [],
  SetStories: (stories: StoryI[]) => {},
})

export const StoryProvider = ({
  children,
}: Readonly<{ children: React.ReactNode }>) => {
  const [stories, setStories] = React.useState<StoryI[]>(() => {
    // Initialize with stored value or empty array if no value exists
    const storedStories = localStorage.getItem('stories')
    return storedStories ? JSON.parse(storedStories) : []
  })

  useEffect(() => {
    // Save stories to localStorage whenever it changes
    localStorage.setItem('stories', JSON.stringify(stories))
  }, [stories])

  const SetStories = (stories: StoryI[]) => {
    setStories(stories)
  }

  return (
    <StoryContext.Provider value={{ stories, SetStories }}>
      {children}
    </StoryContext.Provider>
  )
}
