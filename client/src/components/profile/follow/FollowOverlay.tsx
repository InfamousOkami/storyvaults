import React from 'react'
import FollowListItem from './FollowListItem'
import { UserI } from '@/typings'

function FollowOverlay({
  type,
  close,
  followList,
}: {
  type: string
  close: any
  followList: string[]
}) {
  return (
    <div className="fixed bottom-0 left-0 right-0 top-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
      <div className="relative h-[500px] w-[400px] rounded-md bg-gray-200">
        <button
          onClick={() => close('')}
          className="absolute right-2 top-0 text-2xl text-blue-500 hover:text-blue-600"
        >
          X
        </button>
        <p className="p-1 text-center text-lg font-semibold">
          {type === 'followers' ? 'Followers' : 'Following'}
        </p>
        <div className="divide-y divide-gray-300 border-y border-gray-300">
          {followList.map((userId: string) => (
            <FollowListItem key={userId} userId={userId} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default FollowOverlay
