'use client'

import axios from 'axios'
import React, { useEffect, useState } from 'react'
import LoadingPulse from '../../loading/LoadingSpinner'

import { PostI } from '@/typings'
import SimplePost from './simplePost'

function LastThreePosts() {
  const [posts, setPosts] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const getPosts = async () => {
      try {
        const response = await axios.get(
          'http://localhost:8080/api/v1/post/latest/three'
        )
        setPosts(response.data.data)
        setIsLoading(false)
      } catch (error) {
        console.error('Error fetching posts:', error)
        setIsLoading(false)
      }
    }

    getPosts()
  }, [])

  return (
    <div className="scroller my-2 h-full w-full space-y-2 divide-y-2 divide-gray-300 overflow-y-scroll rounded-md border-b border-gray-300 bg-white p-2 md:max-h-[287px] min-[1175px]:max-w-[500px]">
      {isLoading ? (
        <LoadingPulse />
      ) : (
        posts.map((post: PostI) => <SimplePost key={post._id} post={post} />)
      )}
    </div>
  )
}

export default LastThreePosts
