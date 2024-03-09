import { StoryI } from '@/typings'
import Image from 'next/image'

function CoverTitleCard({ story }: { story: StoryI }) {
  return (
    <div className="max-h-[215px] w-full max-w-[105px]">
      <div className="h-[140px] w-[105px] overflow-hidden rounded-md border border-gray-400">
        <Image
          height={5000}
          width={5000}
          placeholder="empty"
          priority={true}
          src={`http://localhost:8080/assets/${story.userId.username}/${story.picturePath}`}
          alt={story.picturePath ? story.picturePath : story.title}
          className="transition-all hover:scale-110"
        />
      </div>
      <h1 className="line-clamp-2 text-lg font-semibold leading-6 text-gray-800 hover:text-blue-600 hover:underline">
        {story.title}
      </h1>
      <p className="text-sm text-gray-400">{story.genre.name}</p>
    </div>
  )
}

export default CoverTitleCard
