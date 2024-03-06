import HomeHeader from '@/components/home/homeHeader/HomeHeader'
import WeeklyFeatured from '@/components/home/weeklyFeatured/WeeklyFeatured'
import TopGenreStories from '@/components/home/genres/TopGenreStories'

export default function Home() {
  return (
    <main className="w-full bg-gray-100">
      <HomeHeader />

      <WeeklyFeatured />

      <div className="bg-gray-50 pt-1">
        <h1 className="text-center text-2xl font-semibold text-gray-800">
          Genres
        </h1>
        <TopGenreStories genre="65b056040a2c13546c6ffd5a" />
        <TopGenreStories genre="65b198960c0b30374a895ad1" />
      </div>
    </main>
  )
}

{
  /* <AllCategories />

      <TopStoriesScroller
        fieldType="favoriteAmount"
        time="weeklyCount"
        categoryId={'65b0481ed8668f62a497b2b6'}
      />
      <TopStoriesScroller
        fieldType="favoriteAmount"
        time="weeklyCount"
        categoryId={'65b187a36b8b7d623b1db4a4'}
      /> */
}
