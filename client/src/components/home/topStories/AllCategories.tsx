'use client'

import axios from 'axios'
import { useEffect, useState } from 'react'
import TopStories from './TopStories'
import LoadingSpinner from '../../loading/LoadingSpinner'

const getCategoryName = (type: string) => {
  switch (type) {
    case 'shortStory':
      return 'Short Storys'

    case 'book':
      return 'Books'

    case 'lightNovel':
      return 'Light Novels'

    default:
      return 'Books'
  }
}

function AllCategories() {
  const [categories, setCategories] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  const getAllCategories = async () => {
    const data = await axios.get(`http://localhost:8080/api/v1/category`)

    setCategories(data.data.data)
    setIsLoading(false)
  }

  useEffect(() => {
    getAllCategories()
  }, [])

  if (isLoading) return <LoadingSpinner />

  return (
    <div className="flex w-full flex-col items-center gap-10">
      {categories
        .filter((cat: any) => cat.storyAmount > 0)
        .map((cat: any) => (
          <div key={cat._id} className="w-full">
            <h1 className="mb-3 text-center text-2xl font-bold text-gray-700 underline">
              Top 6 {getCategoryName(cat.name)}
            </h1>
            <TopStories categoryId={cat._id} />
          </div>
        ))}
    </div>
  )
}

export default AllCategories
