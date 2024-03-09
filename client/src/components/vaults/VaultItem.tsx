import { VaultI } from '@/typings'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

function VaultItem({
  vault,
  imageHieght,
  imageWidth,
}: {
  vault: VaultI
  imageHieght: string
  imageWidth: string
}) {
  return (
    <Link href={`/vault/${vault._id}`}>
      <div className="flex gap-1 bg-gray-50 hover:bg-gray-200">
        {/* Image */}
        <div
          className={` cursor-pointer overflow-hidden  ${vault.picturePath !== '' ? '' : 'bg-blue-500'} p-1 shadow-sm shadow-gray-600 drop-shadow-lg hover:shadow-lg ${imageWidth} ${imageHieght}`}
          style={{ position: 'relative' }}
        >
          <Image
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            placeholder="empty"
            priority={true}
            src={`http://localhost:8080/assets/${vault.userId.username}/${vault.picturePath}`}
            alt={vault.picturePath ? vault.picturePath : vault.title}
          />
        </div>

        <div className="flex w-full flex-col justify-between">
          {/* Name*/}
          <h1 className="font-semibol">{vault.name}</h1>

          <div className="flex justify-between">
            <p>
              {vault.stories.length}{' '}
              {vault.stories.length === 1 ? 'Story' : 'Stories'}
            </p>
            {/*  @ts-ignore */}
            <p>Updated {vault.updatedAt}</p>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default VaultItem
