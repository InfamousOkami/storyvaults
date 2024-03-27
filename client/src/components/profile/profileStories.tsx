'use client'

import { StoryI, UserI } from '@/typings'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import LoadingPulse from '../loading/LoadingSpinner'
import SimpleCard from '../card/storyCards/SimpleCard'
import FavoritedStories from './FavoritedStories'

const sortButtons = [
  {
    name: 'Created At',
    option: 'createdAt',
  },
  {
    name: 'Updated At',
    option: 'updatedAt',
  },
  {
    name: 'Word Count',
    option: `wordAmount`,
  },
  {
    name: 'Genre',
    option: 'genre',
  },
  {
    name: 'Chapters',
    option: 'chapterAmount',
  },
  {
    name: 'Rating',
    option: 'ratingsAverage.total',
  },
  {
    name: 'Price',
    option: 'price',
  },
]

function ProfileStories({ user }: { user: UserI }) {
  const [isLoading, setIsLoading] = useState(true)
  const [stories, setStories] = useState([])
  const [sortBy, setSortBy] = useState('createdAt')
  const [storyList, setStoryList] = useState('profile')
  const [favoritedStories, setFavoritedStories] = useState<StoryI[]>([])

  const getStories = async (userId: string, sort: string) => {
    const stories = await axios.get(
      `http://localhost:8080/api/v1/stories/user/${userId}?sort=${sort}`
    )

    setStories(stories.data.data)
    setIsLoading(false)
  }

  const getFavoritesStories = async (storyIds: string[]) => {
    const fetchedStories = []
    for (const id of storyIds) {
      const story = await axios.get(
        `http://localhost:8080/api/v1/stories/${id}`
      )
      fetchedStories.push(story.data.data)
    }
    setFavoritedStories(fetchedStories)
    setIsLoading(false)
  }

  useEffect(() => {
    getStories(user._id, sortBy)
    if (user.favoritedStories.length > 0) {
      getFavoritesStories(user.favoritedStories)
    }
  }, [user._id, sortBy])

  if (isLoading) return <LoadingPulse />

  return (
    <div className="bg-gray-50 pt-2">
      <h1 className="text-center text-lg font-medium text-gray-900 underline ">
        {user.username}
        {"'"}s {storyList === 'favorited' && 'Favorited'} Stories
      </h1>
      <div className="flex justify-center gap-2">
        <button
          className={`rounded-lg px-3 py-2 text-white hover:bg-blue-600 ${storyList === 'profile' ? 'bg-blue-600' : 'bg-blue-400'}`}
          onClick={() => setStoryList('profile')}
        >
          Stories
        </button>
        <button
          className={`rounded-lg px-3 py-2 text-white hover:bg-blue-600 ${storyList === 'favorited' ? 'bg-blue-600' : 'bg-blue-400'}`}
          onClick={() => setStoryList('favorited')}
        >
          Favorited
        </button>
      </div>
      <div className="text-center">
        <p className="mb-1 text-lg underline">Sort By</p>
        <div className="mb-2 flex flex-wrap justify-center gap-3">
          {sortButtons.map((button) => (
            <div
              key={button.name}
              className={`cursor-pointer rounded-lg px-3 py-2 text-white hover:bg-blue-600 ${
                sortBy === button.option ? 'bg-blue-600' : 'bg-blue-400'
              }`}
              onClick={() => setSortBy(button.option.toString())}
            >
              {button.name}
            </div>
          ))}
        </div>
      </div>

      <div
        className="flex w-full flex-col justify-center gap-3 px-1 md:flex-row md:flex-wrap
      "
      >
        {storyList === 'profile' ? (
          <>
            {stories.length === 0 && (
              <>
                <p className="m-2 h-fit rounded-lg bg-gray-100 p-5 text-center text-xl font-bold text-gray-700">
                  No Stories
                </p>
              </>
            )}
            {stories
              .filter((s: StoryI) => s.active !== false)
              .map((story: StoryI) => (
                <React.Fragment key={story._id}>
                  <SimpleCard story={story} />
                </React.Fragment>
              ))}
          </>
        ) : (
          <>
            <FavoritedStories stories={favoritedStories} />
          </>
        )}
      </div>
    </div>
  )
}

export default ProfileStories
