import BookmarkList from '@/components/profile/myBookmarks/BookmarkList'
import React from 'react'

function MyBookmarksPage() {
  return (
    <div className="flex flex-col items-center gap-1 py-1">
      <h1 className="text-xl font-bold text-gray-800">My Bookmarks</h1>
      <BookmarkList />
    </div>
  )
}

export default MyBookmarksPage
