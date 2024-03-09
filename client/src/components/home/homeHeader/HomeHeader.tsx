import React from 'react'
import TopStoriesScroller from '../topStories/TopStorySideScroller'
import LastThreePosts from './LastThreePosts'

function HomeHeader() {
  return (
    <div className="flex flex-col items-center justify-center gap-10 rounded-lg bg-white py-5 shadow-sm sm:px-10 md:px-20 min-[1175px]:flex-row">
      {/* Top 5 weekly favorited */}
      <div className="max-w-[500px]">
        <p className="mb-3 text-center text-xl font-bold text-gray-800">
          Weekly Most Favorited Books
        </p>
        <TopStoriesScroller
          fieldType="favoriteAmount"
          time="weeklyCount"
          categoryId={'65b1879d6b8b7d623b1db4a1'}
        />
      </div>

      {/* Last 3 Posts */}
      <div className="min-[1175px]:max-w-[500px]">
        <p className="mb-3 text-center text-xl font-bold text-gray-800">
          Latest Admin Posts
        </p>
        <LastThreePosts />
      </div>
    </div>
  )
}

export default HomeHeader
