'use client'

import { setFollowing } from '@/lib/redux/features/auth-slice'
import { AppDispatch, useAppSelector } from '@/lib/redux/store'
import axios from 'axios'
import React, { useState } from 'react'
import { useDispatch } from 'react-redux'

function FollowButton({
  followUserId,
  following,
}: {
  followUserId: string
  following: boolean
}) {
  const token = useAppSelector((state) => state.auth.token)
  const user = useAppSelector((state) => state.auth.user)

  const [isFollowing, setIsFollowing] = useState(following)

  const dispatch = useDispatch<AppDispatch>()

  const toggleFollow = async () => {
    await axios.patch(
      `http://localhost:8080/api/v1/users/follow/${followUserId}`,
      {},
      {
        headers: {
          Authorization: 'Bearer ' + token,
        },
      }
    )

    if (isFollowing) {
      const newFollowing = user.following.filter((id) => id !== followUserId)
      dispatch(setFollowing({ following: newFollowing }))
      setIsFollowing(false)
    } else {
      const newFollowing = [followUserId, ...user.following]
      dispatch(setFollowing({ following: newFollowing }))
      setIsFollowing(true)
    }
  }

  return (
    <>
      {token && user._id !== followUserId && (
        <button
          onClick={toggleFollow}
          className="rounded-md bg-blue-500 px-2 py-1 text-white hover:bg-blue-600"
        >
          {isFollowing ? 'UnFollow' : 'Follow'}
        </button>
      )}
    </>
  )
}

export default FollowButton
