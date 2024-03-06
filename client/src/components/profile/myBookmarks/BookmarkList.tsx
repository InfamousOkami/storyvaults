'use client'

import BookmarkItem from '@/components/bookmarks/bookmarkItem'
import { setBookmarks } from '@/lib/redux/features/auth-slice'
import { AppDispatch, useAppSelector } from '@/lib/redux/store'
import { BookmarkI } from '@/typings'
import axios from 'axios'
import { useDispatch } from 'react-redux'

function BookmarkList() {
  const token = useAppSelector((state) => state.auth.token)
  const bookmarks = useAppSelector((state) => state.auth.bookmarks)

  const dispatch = useDispatch<AppDispatch>()

  const bookmarkList: BookmarkI[] = bookmarks

  const removeBookmark = async (storyId: string) => {
    await axios.delete(
      `http://localhost:8080/api/v1/bookmark/delete/${storyId}`,
      {
        headers: {
          Authorization: 'Bearer ' + token,
        },
      }
    )

    const updatedBmList: BookmarkI[] = bookmarkList.filter(
      (bm: BookmarkI) => bm.storyId._id !== storyId
    )

    dispatch(setBookmarks({ bookmarks: updatedBmList }))
  }

  const refreshBookmarks = async () => {
    const bookmarks = await axios.get(
      `http://localhost:8080/api/v1/bookmark/user/bookmarks`,
      {
        headers: {
          Authorization: 'Bearer ' + token,
        },
      }
    )

    const bookmarkList = bookmarks.data.data

    dispatch(setBookmarks({ bookmarks: bookmarkList }))
  }

  return (
    <div className="divide flex w-96 flex-col divide-y-2 divide-gray-300 border border-gray-500 bg-white">
      <div onClick={refreshBookmarks}>
        <p className="cursor-pointer bg-blue-500 py-1 text-center text-white hover:bg-blue-600">
          Refresh
        </p>
      </div>
      {bookmarks.length === 0 && (
        <p className="p-5 text-center font-bold text-gray-800">No Bookmarks</p>
      )}
      {bookmarks.map((bm: BookmarkI) => (
        <div key={bm._id}>
          <BookmarkItem bookmark={bm} />
          <button
            onClick={() => removeBookmark(bm.storyId._id)}
            className="w-full bg-red-500 text-white hover:bg-red-600"
          >
            Remove
          </button>
        </div>
      ))}
    </div>
  )
}

export default BookmarkList
