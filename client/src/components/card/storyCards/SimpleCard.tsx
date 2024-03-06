import { BookmarkI, StoryI } from '@/typings'
import Link from 'next/link'
import Breaker from '../../breaker/Breaker'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import { AppDispatch, useAppSelector } from '@/lib/redux/store'
import axios from 'axios'
import { useDispatch } from 'react-redux'
import { setBookmarks } from '@/lib/redux/features/auth-slice'

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

const getCategoryColor = (type: string) => {
  switch (type) {
    case 'shortStory':
      return 'bg-blue-100'

    case 'book':
      return 'bg-green-100'

    case 'lightNovel':
      return 'bg-teal-100'

    default:
      return 'bg-blue-400'
  }
}

// TODO: Add Rating

function SimpleCard({ story }: { story: StoryI }) {
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

  const [active, setActive] = useState(false)

  const getStoryPrice = (accessType: string) => {
    switch (accessType) {
      case 'free':
        return { type: 'Price', amount: 'Free' }

      case 'payFull':
        return { type: 'Full Price', amount: '$' + story.price }

      case 'payByChapter':
        return { type: 'Pay By Chapter', amount: '$' + story.price }

      default:
        return { type: 'Price', amount: 'Free' }
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

    if (bookmark.data.data.length > 0) {
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
    <div
      className={`transition delay-0 duration-300 ease-in-out ${
        active ? `${getCategoryColor(story.category.name)}` : 'bg-white'
      } relative m-auto h-36 w-full rounded-lg border  border-gray-300 shadow-md shadow-gray-300 md:mx-0 md:h-44 lg:w-[49%] xl:w-[32%]`}
      onMouseEnter={() => setActive(true)}
      onMouseLeave={() => setActive(false)}
    >
      <div className="relative flex h-full gap-2">
        {/* Left flex - Image */}
        <div className="relative flex-1">
          <Link className="relative" href={`/story/${story._id}/${story.slug}`}>
            <div
              className={`h-full w-24 cursor-pointer overflow-hidden rounded-lg ${story.picturePath !== '' ? '' : 'bg-blue-500'} p-1 shadow-sm shadow-gray-600 drop-shadow-lg hover:shadow-lg md:w-32`}
              style={{ position: 'relative' }}
            >
              <Image
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                placeholder="empty"
                priority={true}
                src={`http://localhost:8080/assets/${story.userId.username}/${story.picturePath}`}
                alt={story.picturePath ? story.picturePath : story.title}
              />
            </div>
          </Link>
        </div>

        {/* Right Flex  */}
        <div className="flex-2 relative flex h-full w-full flex-col self-start">
          {/* Username & Title, Genre, category, Language */}
          <div className="flex h-full flex-col justify-between">
            {/* Title & Username */}
            <div className="flex h-fit  items-center gap-2 md:text-lg">
              <div className="flex max-w-[310px] flex-wrap items-center self-start leading-6">
                <Link href={`/story/${story._id}/${story.slug}`}>
                  <h1
                    className={`line-clamp-1 text-lg font-bold hover:text-blue-600 ${
                      active ? '' : ''
                    }`}
                  >
                    {story.title}
                  </h1>
                </Link>
                <Link
                  className="flex gap-1"
                  href={`/profile/${story.userId.username}`}
                >
                  <p className="ml-1">By:</p>
                  <p className="font-medium text-blue-600">
                    {story.userId.username}
                  </p>
                </Link>
              </div>

              <div className="flex w-24">
                {/* Status */}
                <p
                  className={`absolute right-1 top-1 text-xs font-medium  ${
                    story.status == 'Incomplete'
                      ? 'text-red-600'
                      : 'text-green-700'
                  }`}
                >
                  {story.status}
                </p>
                {/* Price */}
                <p
                  className={`absolute right-2 top-5 text-center text-2xl font-bold  ${
                    active
                      ? 'right-[3px] top-[19px] rounded-lg border border-gray-300 bg-white px-1 drop-shadow-lg transition delay-0 duration-300 ease-in-out'
                      : ''
                  } text-green-500`}
                >
                  {getStoryPrice(story.readerAccess).amount}
                </p>

                {/* NSFW */}
                {story.nsfw && (
                  <div className="absolute right-1 top-14 ">
                    <p className="rounded-lg bg-red-500 px-2 py-1 text-xs text-white">
                      NSFW
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className={`font-medium ${active ? '' : ''}`}>
              {/* Genre, category, Language */}
              <div className="flex gap-1 text-xs text-gray-500">
                {/* Genre */}
                <p>{story.genre.name}</p>

                <Breaker type="between" />

                {/* Category */}
                <p>{getCategoryName(story.category.name)}</p>

                <Breaker type="between" />

                {/* Language */}
                <p>{story.languageName.name}</p>
              </div>

              {/* Chapters */}
              <div className="text-sm leading-[16px]">
                <div className="flex items-center gap-1">
                  {/* Chapter Amount */}
                  <p>
                    {story.chapterAmount}
                    <span>
                      {' '}
                      {story.chapterAmount === 1 ? 'Chapter' : 'Chapters'}
                    </span>
                  </p>

                  <Breaker type="between" />

                  {/* WordCount */}
                  <p>
                    {story.wordAmount}
                    <span> {story.wordAmount === 1 ? 'Word' : 'Words'}</span>
                  </p>
                </div>

                {/* Rating */}
                <p>
                  Rating:
                  <span> {story.ratingsAverage.total}</span>
                </p>
              </div>
            </div>
          </div>

          {/* Bottom flex - Information */}
          <div className="h-full text-xs text-gray-800 md:text-sm">
            {/* Dates */}
            <div
              className={`absolute bottom-1 left-0 flex flex-col leading-[14px] ${
                active ? '' : ''
              }`}
            >
              {/* Updated At */}
              <p>
                Updated:
                {/* @ts-ignore */}
                <span> {story.updatedAt}</span>
              </p>

              {/* Created At */}
              <p>
                Created:
                {/*@ts-ignore*/}
                <span> {story.createdAt}</span>
              </p>
            </div>

            {/* Bottom Right: Favoites & Bookmarks */}
            <div className={`absolute bottom-1 right-2 ${active ? '' : ''}`}>
              {/* Bookmark Amount  */}
              <p className="flex items-center gap-1">
                {isBookmarked ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="icon icon-tabler icon-tabler-bookmark-filled cursor-pointer text-blue-500 hover:text-blue-600"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    onClick={() => {
                      setBookmarkAvailible(false)
                      toggleBookmark()
                    }}
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
                    className="icon icon-tabler icon-tabler-bookmark cursor-pointer text-blue-500 hover:text-blue-600"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    onClick={() => {
                      setBookmarkAvailible(false)
                      toggleBookmark()
                    }}
                  >
                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                    <path d="M18 7v14l-6 -4l-6 4v-14a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4z" />
                  </svg>
                )}
                <span> {bookamrkAmount}</span>
              </p>

              {/* Favorites */}
              <p className={`flex items-center gap-1 `}>
                {isFavorited ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="icon icon-tabler icon-tabler-heart-filled cursor-pointer text-red-600 hover:text-red-700"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    onClick={() => {
                      setFavoriteAvailible(false)
                      PatchFavorite()
                    }}
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
                    className="icon icon-tabler icon-tabler-heart cursor-pointer text-red-600 hover:text-red-700"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    onClick={() => {
                      setFavoriteAvailible(false)
                      PatchFavorite()
                    }}
                  >
                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                    <path d="M19.5 12.572l-7.5 7.428l-7.5 -7.428a5 5 0 1 1 7.5 -6.566a5 5 0 1 1 7.5 6.572" />
                  </svg>
                )}
                <span> {favoriteAmount}</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SimpleCard
