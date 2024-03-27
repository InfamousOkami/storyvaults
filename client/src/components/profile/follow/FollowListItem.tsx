'use client'

import LoadingPulse from '@/components/loading/LoadingSpinner'
import { UserI } from '@/typings'
import axios from 'axios'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import FollowButton from './FollowButton'
import { useAppSelector } from '@/lib/redux/store'
import Link from 'next/link'

function FollowListItem({ userId }: { userId: string }) {
  const LoggedInUser = useAppSelector((state) => state.auth.user)

  const [user, setUser] = useState<UserI | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isFollowing, setIsFollowing] = useState(false)

  const getUser = async (userId: string) => {
    const curUser = await axios.get(
      `http://localhost:8080/api/v1/users/${userId}`
    )

    setUser(curUser.data.data)

    const isUserFollowed = curUser.data.data.followers.includes(
      LoggedInUser._id
    )

    if (isUserFollowed) {
      setIsFollowing(true)
    }
  }

  // Add Detail and Follow Button
  useEffect(() => {
    console.log(userId)
    getUser(userId)
    setIsLoading(false)
  }, [userId])

  if (isLoading) <LoadingPulse />

  return (
    <div className="flex flex-col justify-center p-2">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="size-10 overflow-hidden rounded-full border border-gray-400">
            <Image
              width={50}
              height={50}
              src={`
                  ${user?.picturePath !== 'default.webp' ? `http://localhost:8080/assets/${user?.username}/${user?.picturePath}` : `http://localhost:8080/assets/${user?.picturePath}`}
                  `}
              alt="Profile picture"
            />
          </div>
          <Link
            href={`/profile/${user?.username}`}
            className="w-fit cursor-pointer justify-self-start font-semibold text-gray-800 hover:text-blue-600"
          >
            {user?.username}
          </Link>
        </div>

        <FollowButton following={isFollowing} followUserId={userId} />
      </div>
      <div className="flex gap-3 pt-1">
        <p className="line-clamp-3">{user?.bio}</p>
      </div>
    </div>
  )
}

export default FollowListItem
