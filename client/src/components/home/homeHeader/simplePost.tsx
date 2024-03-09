import { PostI } from '@/typings'
import Image from 'next/image'
import React from 'react'

function SimplePost({ post }: { post: PostI }) {
  return (
    <div className="flex w-full gap-2 min-[1175px]:max-w-[500px]">
      <div className="flex flex-col">
        <p className="text-lg font-semibold text-gray-900 underline">
          {post.subject}
        </p>
        <p className="text-sm text-gray-600">{post.postContent}</p>
      </div>
      <div className="relative mt-1 h-full max-h-14 w-full max-w-14 self-start overflow-hidden rounded-full border border-gray-300">
        <Image
          width={500}
          height={500}
          priority
          placeholder="empty"
          src={
            post.userId.picturePath != 'default.webp'
              ? `http://localhost:8080/assets/${post.userId.username}/${post.userId.picturePath}`
              : `http://localhost:8080/assets/default.webp`
          }
          alt={post.userId.username}
        />
      </div>
    </div>
  )
}

export default SimplePost
