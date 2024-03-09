'use client'

import { StoryI } from '@/typings'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

function TopCard({ story, isActive }: { story: StoryI; isActive: boolean }) {
  const router = useRouter()

  const bgImageUrl = `http://localhost:8080/assets/${story.userId.username}/${story.picturePath}`

  return (
    <div
      className={`relative h-[400px] w-full min-w-[320px] max-w-[500px] cursor-pointer overflow-hidden rounded-md sm:h-80 md:h-72 ${isActive ? '' : 'hidden'}`}
      onClick={() => router.push(`/story/${story._id}/${story.slug}`)}
    >
      {/* Content */}
      <div className="absolute left-0 top-0 z-10 flex h-full w-full flex-col items-center justify-center gap-3 bg-black bg-opacity-35 px-5 pt-5 sm:flex-row sm:pt-0  ">
        <Image
          className="h-[65%] w-28 basis-[20%] rounded-[4px] border border-black shadow-md shadow-black sm:w-full md:h-[75%] md:basis-[35%]"
          src={bgImageUrl}
          priority={true}
          placeholder="empty"
          width={500}
          height={500}
          alt={story.title}
        />

        {/* Title & Description */}
        <div className="flex-2 flex basis-[60%] flex-col gap-2 text-white sm:basis-[65%]">
          <p className="line-clamp-2 font-semibold md:text-xl">{story.title}</p>
          <p className="line-clamp-5 text-sm font-normal">
            {story.description}
          </p>
        </div>
      </div>

      {/* Bg */}
      <div className={`relative h-full w-full  blur-md`}>
        <Image
          className="absolute top-[-100px] w-full"
          src={bgImageUrl}
          priority={true}
          placeholder="empty"
          width={5000}
          height={5000}
          alt={story.title}
        />
      </div>
    </div>
  )
}

export default TopCard
