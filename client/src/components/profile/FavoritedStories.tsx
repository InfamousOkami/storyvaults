import { StoryI } from '@/typings'
import React from 'react'
import SimpleCard from '../card/storyCards/SimpleCard'

function FavoritedStories({ stories }: { stories: StoryI[] }) {
  return (
    <div>
      <p className="m-2 h-fit rounded-lg bg-gray-100 p-5 text-center text-xl font-bold text-gray-700">
        No Favorited Stories
      </p>
      {stories.map((story: StoryI) => (
        <SimpleCard key={story._id} story={story} />
      ))}
    </div>
  )
}

export default FavoritedStories
