'use client'

import axios from 'axios'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import LoadingPulse from '../loading/LoadingSpinner'
import { ChapterI, StoryI } from '@/typings'
import DetailedCard from '../card/storyCards/DetailedCard'
import { useAppSelector } from '@/lib/redux/store'
import parse from 'html-react-parser'

function ChapterContent() {
  const token = useAppSelector((state) => state.auth.token)
  const user = useAppSelector((state) => state.auth.user)

  const params = useParams()

  const [chapter, setChapter] = useState<ChapterI | null>(null)
  const [storyO, setStory] = useState<StoryI | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isLiked, setIsLiked] = useState(false)

  const getchapters = async (storyId: string, chapterNum: number) => {
    const chapter = await axios.get(
      `http://localhost:8080/api/v1/chapter/${storyId}/${chapterNum}`
    )

    const curChapter = chapter.data.data

    setChapter(curChapter)

    if (token) {
      if (curChapter.likes) {
        setIsLiked(curChapter.likes[user._id])
      }
    }
  }

  const getStory = async (storyId: string) => {
    const story = await axios.get(
      `http://localhost:8080/api/v1/stories/${storyId}`
    )

    setStory(story.data.data)
  }

  const updateBookmark = async (bookmarkId: string) => {
    const bookmark = await axios.patch(
      `http://localhost:8080/api/v1/bookmark/update/${bookmarkId}`,
      {
        chapterNumber: params.chapterNumber,
      },
      {
        headers: {
          Authorization: 'Bearer ' + token,
        },
      }
    )
  }

  const getBookmark = async (storyId: string) => {
    const bookmarkCheck = await axios.get(
      `http://localhost:8080/api/v1/bookmark/${storyId}`,
      {
        headers: {
          Authorization: 'Bearer ' + token,
        },
      }
    )
    const bookmark = bookmarkCheck.data.data

    if (
      bookmark &&
      Number(bookmark.chapterNumber) < Number(params.chapterNumber as string)
    ) {
      updateBookmark(bookmark._id)
    }
  }

  const updateChapterViews = async () => {
    await axios.patch(
      `http://localhost:8080/api/v1/chapter/chapter/views/${chapter!._id}`,
      {}
    )
  }

  const toggleLike = async () => {
    await axios.patch(
      `http://localhost:8080/api/v1/chapter/favorite/${chapter!._id}`,
      {},
      {
        headers: {
          Authorization: 'Bearer ' + token,
        },
      }
    )

    setIsLiked(!isLiked)
  }

  useEffect(() => {
    if (token) {
      getBookmark(params.id as string)
    }
    getStory(params.id as string)
    getchapters(params.id as string, Number(params.chapterNumber as string))

    setIsLoading(false)
  }, [params.id, params.chapterNumber])

  useEffect(() => {
    if (chapter && chapter.userId !== user._id) {
      setTimeout(() => {
        updateChapterViews()
      }, 5000)
    }
  }, [chapter])

  if (isLoading) return <LoadingPulse />

  return (
    <div className="relative flex flex-col gap-2">
      {storyO && <DetailedCard story={storyO} />}
      <div className="relative m-1 rounded-lg bg-gray-100 p-2">
        {/* Favorite Button */}
        <div
          className="absolute right-5 top-5 cursor-pointer rounded-lg p-1 text-center text-white"
          onClick={() => {
            toggleLike()
          }}
        >
          {/* Price */}
          {isLiked ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="icon icon-tabler icon-tabler-heart-filled text-red-600 hover:text-red-700"
              width="48"
              height="48"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path
                d="M6.979 3.074a6 6 0 0 1 4.988 1.425l.037 .033l.034 -.03a6 6 0 0 1 4.733 -1.44l.246 .036a6 6 0 0 1 3.364 10.008l-.18 .185l-.048 .041l-7.45 7.379a1 1 0 0 1 -1.313 .082l-.094 -.082l-7.493 -7.422a6 6 0 0 1 3.176 -10.215z"
                strokeWidth="0"
                fill="currentColor"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="icon icon-tabler icon-tabler-heart text-red-600 hover:text-red-700"
              width="48"
              height="48"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M19.5 12.572l-7.5 7.428l-7.5 -7.428a5 5 0 1 1 7.5 -6.566a5 5 0 1 1 7.5 6.572" />
            </svg>
          )}
        </div>
        <p className="text-center text-4xl font-bold text-gray-700 underline">
          {chapter?.name}
        </p>
        <p className="text-lg">
          {chapter?.chapterContent && parse(chapter.chapterContent)}
        </p>
      </div>
    </div>
  )
}

export default ChapterContent
