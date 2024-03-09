import { BookmarkI } from '@/typings'
import Image from 'next/image'
import Link from 'next/link'

function BookmarkItem({ bookmark }: { bookmark: BookmarkI }) {
  return (
    <Link
      href={
        bookmark.chapterNumber === 0
          ? `/story/${bookmark.storyId._id}/${bookmark.storyId.slug}`
          : `/story/${bookmark.storyId._id}/${bookmark.storyId.slug}/${bookmark.chapterNumber}`
      }
    >
      <div className="bg-gray-50 p-1 hover:bg-gray-200">
        <div className="flex gap-2">
          {/* Image */}
          <div
            className={`h-24 w-20 cursor-pointer overflow-hidden rounded-lg ${bookmark.storyId.picturePath !== '' ? '' : 'bg-blue-500'} p-1 shadow-sm shadow-gray-600 drop-shadow-lg hover:shadow-lg `}
            style={{ position: 'relative' }}
          >
            <Image
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              placeholder="empty"
              priority={true}
              src={`http://localhost:8080/assets/${bookmark.authorUsername}/${bookmark.storyId.picturePath}`}
              alt={
                bookmark.storyId.picturePath
                  ? bookmark.storyId.picturePath
                  : bookmark.storyId.title
              }
            />
          </div>

          <div className="flex w-full flex-col justify-between">
            {/* Title & Status */}
            <div className="flex  justify-between">
              {/* Title */}
              <h1 className="font-semibol">{bookmark.storyId.title}</h1>

              {/* Status */}
              <p
                className={`${bookmark.storyId.status === 'Incomplete' ? 'text-red-500' : 'text-green-500'}`}
              >
                {bookmark.storyId.status}
              </p>
            </div>

            {/* Chapter & updated */}
            <div className="flex justify-between">
              <p>
                Chapter {bookmark.chapterNumber}/
                {bookmark.storyId.chapterAmount}
              </p>
              <p>Updated {bookmark.storyId.updatedAt}</p>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default BookmarkItem
