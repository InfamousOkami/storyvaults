'use client'

import { AppDispatch, useAppSelector } from '@/lib/redux/store'
import BookmarkItem from './bookmarkItem'
import { BookmarkI } from '@/typings'
import axios from 'axios'
import { useDispatch } from 'react-redux'
import { setBookmarks } from '@/lib/redux/features/auth-slice'

function Bookmarks() {
  const bookmarks = useAppSelector((state) => state.auth.bookmarks)
  const token = useAppSelector((state) => state.auth.token)

  const dispatch = useDispatch<AppDispatch>()

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
    <div className="absolute right-0 top-11 flex h-fit max-h-96 w-96 flex-col  divide-gray-300  border border-gray-800 bg-white">
      <div onClick={refreshBookmarks}>
        <p className="cursor-pointer bg-blue-500 py-1 text-center text-white hover:bg-blue-600">
          Refresh
        </p>
      </div>
      {bookmarks.length === 0 && (
        <p className="p-5 text-center font-bold text-gray-800 ">No Bookmarks</p>
      )}
      <div className="divide scroller flex flex-col divide-y-2 overflow-y-scroll">
        {bookmarks.map((bm: BookmarkI) => (
          <BookmarkItem key={bm._id} bookmark={bm} />
        ))}
      </div>
    </div>
  )
}

export default Bookmarks
