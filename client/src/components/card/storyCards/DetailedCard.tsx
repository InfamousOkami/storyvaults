'use client'

import { useEffect, useState } from 'react'
import { AppDispatch, useAppSelector } from '@/lib/redux/store'
import axios from 'axios'
import { BookmarkI, StoryI } from '@/typings'
import Breaker from '../../breaker/Breaker'
import Image from 'next/image'
import Link from 'next/link'
import { useDispatch } from 'react-redux'
import { setBookmarks } from '@/lib/redux/features/auth-slice'
import AddVaultButton from '@/components/buttons/AddVaultButton'

// TODO: Rating

function DetailedCard({ story }: { story: StoryI }) {
  const token = useAppSelector((state) => state.auth.token)
  const user = useAppSelector((state) => state.auth.user)
  const bookmarks = useAppSelector((state) => state.auth.bookmarks)

  const dispatch = useDispatch<AppDispatch>()

  const [isFavorited, setIsFavorited] = useState(false)
  const [isBookmarked, setIsBookmarked] = useState(false)

  const [favoriteAmount, setFavoriteAmount] = useState(
    story.favoriteAmount.total
  )
  const [bookamrkAmount, setbookamrkAmount] = useState(
    story.bookmarkAmount.total
  )

  const [favoriteAvailible, setFavoriteAvailible] = useState(true)
  const [BookmarkAvailible, setBookmarkAvailible] = useState(true)

  const bookmarkList: BookmarkI[] = bookmarks

  const getStoryPrice = (accessType: string) => {
    switch (accessType) {
      case 'free':
        return { type: 'Price', amount: 'Free' }

      case 'payFull':
        return { type: 'Full Price', amount: story.price }

      case 'payByChapter':
        return { type: 'Pay By Chapter', amount: story.price }

      default:
        return { type: 'Price', amount: 'Free' }
    }
  }

  const getCategoryName = (type: string) => {
    switch (type) {
      case 'shortStory':
        return 'Short Story'

      case 'book':
        return 'Books'

      case 'lightNovel':
        return 'Light Novels'

      default:
        return 'Books'
    }
  }

  const getBookmark = async () => {
    const bookmark = await axios.get(
      `http://localhost:8080/api/v1/bookmark/${story._id}`,
      {
        headers: {
          Authorization: 'Bearer ' + token,
        },
      }
    )

    if (bookmark.data.data) {
      setIsBookmarked(true)
    }
  }

  const toggleBookmark = async () => {
    if (BookmarkAvailible) {
      if (!isBookmarked) {
        const bookmark = await axios.post(
          `http://localhost:8080/api/v1/bookmark/new`,
          {
            storyId: story._id,
            authorUsername: story.userId.username,
          },
          {
            headers: {
              'content-type': 'application/json',
              Authorization: 'Bearer ' + token,
            },
          }
        )

        const newBookmark: BookmarkI = bookmark.data.data

        const updatedBmList: BookmarkI[] = [newBookmark, ...bookmarkList]

        dispatch(setBookmarks({ bookmarks: updatedBmList }))

        if (bookmark) setIsBookmarked(true)
        setbookamrkAmount((prevAmount) => prevAmount + 1)
      } else {
        const bookmark = await axios.delete(
          `http://localhost:8080/api/v1/bookmark/delete/${story._id}`,
          {
            headers: {
              'content-type': 'application/json',
              Authorization: 'Bearer ' + token,
            },
          }
        )

        const updatedBmList: BookmarkI[] = bookmarkList.filter(
          (bm: BookmarkI) => bm.storyId._id !== story._id
        )

        dispatch(setBookmarks({ bookmarks: updatedBmList }))

        if (bookmark) setIsBookmarked(false)
        setbookamrkAmount((prevAmount) => prevAmount - 1)
      }
    }
  }

  const PatchFavorite = async () => {
    if (favoriteAvailible) {
      await axios.patch(
        `http://localhost:8080/api/v1/stories/${story._id}/favorite`,
        {},
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: 'Bearer ' + token,
          },
        }
      )

      setIsFavorited(!isFavorited)

      if (!isFavorited) {
        setFavoriteAmount((prevAmount) => prevAmount + 1)
      } else {
        setFavoriteAmount((prevAmount) => prevAmount - 1)
      }
    }
  }

  useEffect(() => {
    if (token && user) {
      getBookmark()
      if (story.favorites) {
        // @ts-ignore
        setIsFavorited(story.favorites[user._id])
      }
    }
  }, [])

  useEffect(() => {
    setTimeout(() => {
      setFavoriteAvailible(true)
      setBookmarkAvailible(true)
    }, 2000)
  }, [favoriteAvailible, BookmarkAvailible])

  return (
    <div className="relative">
      <div className="rounded-lg border  border-gray-200 bg-gray-100">
        <div className="m-1 flex gap-2 p-1">
          {/* Left flex - Image */}
          <div className=" flex-1 ">
            <div
              className={`h-36 w-24 cursor-pointer rounded-lg ${story.picturePath !== '' ? 'shadow-sm shadow-gray-600 drop-shadow-lg' : 'bg-gray-500 shadow-sm shadow-gray-600 drop-shadow-lg'} overflow-hidden hover:shadow-lg md:h-80 md:w-56`}
            >
              <Image
                width={5000}
                height={5000}
                priority={true}
                placeholder="empty"
                src={`http://localhost:8080/assets/${story.userId.username}/${story.picturePath}`}
                alt={story.picturePath ? story.picturePath : story.title}
              />
            </div>
          </div>

          {/* Right Flex - title, username, description */}
          <div className="flex-2 relative w-full self-start">
            {/* Title & Username */}
            <div className="text-md flex gap-2 md:text-lg">
              <Link href={`/story/${story._id}/${story.slug}`}>
                <h1 className=" mb-1 text-xl font-semibold underline hover:text-gray-500">
                  {story.title}
                </h1>
              </Link>

              <Link
                className="flex gap-1"
                href={`/profile/${story.userId.username}`}
              >
                <p>By:</p>
                <p className="text-blue-700">{story.userId.username}</p>
              </Link>
            </div>

            {/* Description */}
            <div className="border-x border-gray-200 px-2">
              <p className="text-xs md:text-lg md:leading-6">
                {story.description}
              </p>
            </div>

            {/* NSFW */}
            {story.nsfw && (
              <div className="absolute right-0 top-0 ">
                <p className="rounded-lg bg-red-500 px-2 py-1 text-lg text-white">
                  NSFW
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Bottom flex - Information */}
        <div className="flex justify-between gap-1 bg-gray-200">
          <div className=" flex flex-wrap items-center gap-[.2rem] rounded-lg p-2 text-xs leading-3 text-gray-800 md:gap-[.4rem] md:text-sm">
            {/* Status */}
            <p>
              Status:
              <span> {story.status}</span>
            </p>
            <Breaker type="between" />

            {/* Genre */}
            <p>{story.genre.name}</p>
            <Breaker type="between" />

            {/* Category */}
            <p>{getCategoryName(story.category.name)}</p>
            <Breaker type="between" />

            {/* Language */}
            <p> {story.languageName.name}</p>
            <Breaker type="between" />

            {/* Chapter Amount */}
            <p>
              Chapters:
              <span> {story.chapterAmount}</span>
            </p>
            <Breaker type="between" />

            {/* WordCount */}
            <p>
              Wordcount:
              <span> {story.wordAmount}</span>
            </p>
            <Breaker type="between" />

            {/* Favorites */}
            <p>
              Favorites:
              <span> {favoriteAmount}</span>
            </p>
            <Breaker type="between" />

            {/* Bookmark Amount  */}
            <p>
              Bookmarks:
              <span> {bookamrkAmount}</span>
            </p>
            <Breaker type="between" />

            {/* Comment Amount */}
            <p>
              Comments:
              <span> {story.commentAmount}</span>
            </p>
            <Breaker type="between" />

            {/* Rating */}
            <p>
              Rating:
              <span> {story.ratingsAverage.total}</span>
            </p>
            <Breaker type="between" />

            {/* Updated At */}
            <p>
              Updated:
              {/*@ts-ignore*/}
              <span> {story.updatedAt}</span>
            </p>
            <Breaker type="between" />

            {/* Created At */}
            <p>
              Created:
              {/*@ts-ignore*/}
              <span> {story.createdAt}</span>
            </p>
          </div>

          {/* Buttons */}
          <div className="flex flex-col gap-1 min-[1110px]:flex-row">
            <div className="flex gap-1 self-end">
              {/* Favorite Button */}
              <div
                className=" cursor-pointer rounded-lg p-1 text-center text-white"
                onClick={() => {
                  setFavoriteAvailible(false)
                  PatchFavorite()
                }}
              >
                {/* Price */}
                {isFavorited ? (
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

              {/* Bookmark Button */}
              <div
                className=" cursor-pointer rounded-lg p-1 text-center text-white "
                onClick={() => {
                  setBookmarkAvailible(false)
                  toggleBookmark()
                }}
              >
                {/* bookmark */}
                {isBookmarked ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="icon icon-tabler icon-tabler-bookmark-filled text-blue-500 hover:text-blue-600"
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
                      d="M14 2a5 5 0 0 1 5 5v14a1 1 0 0 1 -1.555 .832l-5.445 -3.63l-5.444 3.63a1 1 0 0 1 -1.55 -.72l-.006 -.112v-14a5 5 0 0 1 5 -5h4z"
                      strokeWidth="0"
                      fill="currentColor"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="icon icon-tabler icon-tabler-bookmark text-blue-500 hover:text-blue-600"
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
                    <path d="M18 7v14l-6 -4l-6 4v-14a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4z" />
                  </svg>
                )}
              </div>
            </div>

            {/* Pay Button */}
            <div className="w-52 cursor-pointer rounded-lg bg-green-500 p-1 text-center text-white hover:bg-green-600">
              {/* Price */}
              <p className="">{getStoryPrice(story.readerAccess).type}:</p>
              <p className="text-xl font-bold">
                {story.readerAccess !== 'free' && '$'}
                {getStoryPrice(story.readerAccess).amount}
              </p>
            </div>
          </div>
        </div>
      </div>
      {token && (
        <div className="absolute right-5 top-5">
          <AddVaultButton storyId={story._id} />
        </div>
      )}
    </div>
  )
}

export default DetailedCard
