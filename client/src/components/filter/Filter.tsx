'use client'

import axios from 'axios'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

import { ChangeEvent, FormEvent, useEffect, useState } from 'react'
import LoadingPulse from '../loading/LoadingSpinner'
import { CategoryI, GenreI, LanguageI } from '@/typings'

const getCategoryName = (type: string) => {
  switch (type) {
    case 'shortStory':
      return 'Short Story'

    case 'book':
      return 'Books'

    case 'lightNovel':
      return 'Light Novels'

    default:
      return 'Unidentified'
  }
}

function Filter() {
  const searchParams = useSearchParams()

  // Load Use States
  const [genres, setGenres] = useState([])
  const [languages, setLanguages] = useState([])
  const [categories, setCategories] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  // Params Use States
  const [keywords, setKeywords] = useState(
    searchParams.has('keywords') ? searchParams.get('keywords') ?? '' : ''
  )

  const [readersAccess, setReadersAccess] = useState(
    searchParams.has('readersAccess') ? searchParams.get('readersAccess') : ''
  )

  const [sortOrder, setSortOrder] = useState(
    searchParams.has('readersAccess')
      ? searchParams.get('readersAccess')
      : 'desc'
  )

  const [sortBy, setSortBy] = useState(
    searchParams.has('sort') ? searchParams.get('sort') : 'updatedAt'
  )

  const [category, setCategory] = useState(
    searchParams.has('category') ? searchParams.get('category') : ''
  )

  const [genre, setGenre] = useState(
    searchParams.has('genre') ? searchParams.get('genre') : ''
  )

  const [language, setLanguage] = useState(
    searchParams.has('languageName') ? searchParams.get('languageName') : ''
  )

  const [status, setStatus] = useState(
    searchParams.has('status') ? searchParams.get('status') : ''
  )

  const [nsfw, setNsfw] = useState(
    searchParams.has('nsfw') ? searchParams.get('nsfw') : 'false'
  )

  const [limit, setLimit] = useState(
    searchParams.has('limit') ? searchParams.get('limit') : '30'
  )

  const getData = async () => {
    const genres = await axios.get(`http://localhost:8080/api/v1/genre`)
    setGenres(genres.data.data)

    const languages = await axios.get(`http://localhost:8080/api/v1/language`)
    setLanguages(languages.data.data)

    const categories = await axios.get(`http://localhost:8080/api/v1/category`)
    setCategories(categories.data.data)

    setIsLoading(false)
  }

  useEffect(() => {
    getData()
  }, [])

  const router = useRouter()
  const pathname = usePathname()

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const params = new URLSearchParams(searchParams.toString())

    if (keywords) {
      params.set('keywords', keywords!)
    } else {
      params.delete('keywords')
    }
    params.set('sortOrder', sortOrder!)
    params.set('sort', sortBy!)
    params.set('limit', limit!)
    params.set('page', '1')

    if (category) {
      params.set('category', category)
    } else {
      params.delete('category')
    }

    if (genre) {
      params.set('genre', genre)
    } else {
      params.delete('genre')
    }

    if (language) {
      params.set('languageName', language)
    } else {
      params.delete('languageName')
    }

    if (status) {
      params.set('status', status)
    } else {
      params.delete('status')
    }

    if (nsfw) {
      params.set('nsfw', nsfw)
    } else {
      params.delete('nsfw')
    }

    if (readersAccess) {
      params.set('readerAccess', readersAccess!)
    } else {
      params.delete('readerAccess')
    }

    router.push(pathname + '?' + params.toString())
  }

  if (isLoading) <LoadingPulse />

  return (
    <div className="mx-auto mb-5 w-[98%] pt-5 md:max-w-[600px]">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col items-center gap-3 "
      >
        {/* keywords, sort order, sort by */}
        <div className="flex flex-col items-center gap-3 md:flex-row">
          {/* Keyword Search */}
          <label htmlFor="keywords" />
          <input
            className="w-full rounded-md border border-black px-1 py-1 md:w-56"
            type="text"
            placeholder="Search..."
            name="keywords"
            value={keywords}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              setKeywords(e.target.value)
            }}
          />

          {/* Sort Order, Sort By */}
          <div className="flex gap-2">
            {/* Sort Order */}
            <div className="flex">
              <label>Sort Order:</label>
              <label className="flex cursor-pointer">
                <input
                  type="radio"
                  name="sortOrder"
                  value="desc"
                  checked={sortOrder === 'desc'}
                  onChange={() => setSortOrder('desc')}
                  hidden
                />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`icon icon-tabler icon-tabler-arrow-narrow-down ${
                    sortOrder === 'desc' ? 'text-blue-600' : 'text-gray-700'
                  }`}
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                  <path d="M12 5l0 14" />
                  <path d="M16 15l-4 4" />
                  <path d="M8 15l4 4" />
                </svg>
              </label>
              <label className="flex cursor-pointer">
                <input
                  type="radio"
                  name="sortOrder"
                  value="asc"
                  checked={sortOrder === 'asc'}
                  onChange={() => setSortOrder('asc')}
                  hidden
                />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`icon icon-tabler icon-tabler-arrow-narrow-up ${
                    sortOrder === 'asc' ? 'text-blue-600' : 'text-gray-700'
                  }`}
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                  <path d="M12 5l0 14" />
                  <path d="M16 9l-4 -4" />
                  <path d="M8 9l4 -4" />
                </svg>
              </label>
            </div>

            {/* SortBy */}
            <div className="flex gap-1">
              <label htmlFor="sortBy">Sort By</label>
              <select
                name="sortBy"
                id=""
                className=""
                value={sortBy as string}
                onChange={(e: FormEvent<HTMLSelectElement>) =>
                  setSortBy((e.target as HTMLSelectElement).value)
                }
              >
                <option value="updatedAt">Updated At</option>
                <option value="createdAt">Created At</option>
                <option value="price">Price</option>
                <option value="title">Title</option>
                <option value="ratingsAverage">Rating</option>
                <option value="chapterAmount">Chapters</option>
                <option value="wordAmount">Word Count</option>
                <option value="favoriteAmount.total">Favorites</option>
              </select>
            </div>
          </div>
        </div>

        {/* Category, Genre */}
        <div className="flex w-full gap-1">
          {/* Category */}
          <label htmlFor="category">Category</label>
          <select
            name="category"
            id=""
            className="flex-1"
            value={category as string}
            onChange={(e: FormEvent<HTMLSelectElement>) =>
              setCategory((e.target as HTMLSelectElement).value)
            }
          >
            <option value="">All</option>
            {categories.map((cat: CategoryI) => (
              <option key={cat._id} value={cat._id}>
                {getCategoryName(cat.name)}
              </option>
            ))}
          </select>

          {/* Genre */}
          <label htmlFor="genre">Genre</label>
          <select
            name="genre"
            id=""
            className="flex-1"
            value={genre as string}
            onChange={(e: FormEvent<HTMLSelectElement>) =>
              setGenre((e.target as HTMLSelectElement).value)
            }
          >
            <option value="">All</option>
            {genres.map((gen: GenreI) => (
              <option key={gen._id} value={gen._id}>
                {gen.name}
              </option>
            ))}
          </select>
        </div>

        {/* Language, ReaderAceess */}
        <div className="flex w-full gap-1">
          {/* Language */}
          <label htmlFor="language">Language</label>
          <select
            name="language"
            id=""
            className="flex-1"
            value={language as string}
            onChange={(e: FormEvent<HTMLSelectElement>) =>
              setLanguage((e.target as HTMLSelectElement).value)
            }
          >
            <option value="">All</option>
            {languages.map((language: LanguageI) => (
              <option key={language._id} value={language._id}>
                {language.name}
              </option>
            ))}
          </select>

          {/* ReaderAccess */}
          <label htmlFor="readerAccess">Pay Type</label>
          <select
            name="readerAccess"
            id=""
            className="flex-1"
            value={readersAccess as string}
            onChange={(e: FormEvent<HTMLSelectElement>) =>
              setReadersAccess((e.target as HTMLSelectElement).value)
            }
          >
            <option value="">Any</option>
            <option value="free">Free</option>
            <option value="payFull">Full</option>
            <option value="payByChapter">Chapter</option>
          </select>
        </div>

        {/* Status & NSFW */}
        <div className="flex gap-1 self-center">
          {/* Status */}
          <label htmlFor="status">Status</label>
          <select
            name="status"
            id=""
            className=""
            value={status as string}
            onChange={(e: FormEvent<HTMLSelectElement>) =>
              setStatus((e.target as HTMLSelectElement).value)
            }
          >
            <option value="">All</option>
            <option value="Incomplete">Incomplete</option>
            <option value="Complete">Complete</option>
          </select>

          {/* NSFW */}
          <label htmlFor="nsfw">NSFW</label>
          <select
            name="nsfw"
            id=""
            className=""
            value={nsfw as string}
            onChange={(e: FormEvent<HTMLSelectElement>) =>
              setNsfw((e.target as HTMLSelectElement).value)
            }
          >
            <option value="">All</option>
            <option value="true">Yes</option>
            <option value="false">No</option>
          </select>

          {/* limit */}
          <label htmlFor="limit">Per Page</label>
          <select
            name="limit"
            id=""
            className=""
            onChange={(e: FormEvent<HTMLSelectElement>) =>
              setLimit((e.target as HTMLSelectElement).value)
            }
          >
            <option value="30">30</option>
            <option value="60">60</option>
            <option value="90">90</option>
          </select>
        </div>

        {/* Submit Button */}
        <button
          className="w-56 self-center rounded-lg bg-blue-500 py-2 text-white hover:bg-blue-700"
          type="submit"
        >
          Submit
        </button>
      </form>
    </div>
  )
}

export default Filter
