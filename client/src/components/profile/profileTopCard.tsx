import { UserI } from '@/typings'
import Link from 'next/link'
import React from 'react'
import Breaker from '../breaker/Breaker'
import Image from 'next/image'

const GetLinkIcon = (type: string) => {
  switch (type) {
    case 'youtube':
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="icon icon-tabler icon-tabler-brand-youtube-filled text-red-600"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          strokeWidth="2"
          stroke="currentColor"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
          <path
            d="M18 3a5 5 0 0 1 5 5v8a5 5 0 0 1 -5 5h-12a5 5 0 0 1 -5 -5v-8a5 5 0 0 1 5 -5zm-9 6v6a1 1 0 0 0 1.514 .857l5 -3a1 1 0 0 0 0 -1.714l-5 -3a1 1 0 0 0 -1.514 .857z"
            strokeWidth="0"
            fill="currentColor"
          />
        </svg>
      )
    case 'instagram':
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="icon icon-tabler icon-tabler-brand-instagram text-purple-700"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          strokeWidth="2"
          stroke="currentColor"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
          <path d="M4 4m0 4a4 4 0 0 1 4 -4h8a4 4 0 0 1 4 4v8a4 4 0 0 1 -4 4h-8a4 4 0 0 1 -4 -4z" />
          <path d="M12 12m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" />
          <path d="M16.5 7.5l0 .01" />
        </svg>
      )
    case 'linktree':
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="icon icon-tabler icon-tabler-brand-linktree text-green-600"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          strokeWidth="2"
          stroke="currentColor"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
          <path d="M4 10h16" />
          <path d="M6.5 4.5l11 11" />
          <path d="M6.5 15.5l11 -11" />
          <path d="M12 10v-8" />
          <path d="M12 15v7" />
        </svg>
      )
    case 'twitter':
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="icon icon-tabler icon-tabler-brand-twitter-filled text-blue-400"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          strokeWidth="2"
          stroke="currentColor"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
          <path
            d="M14.058 3.41c-1.807 .767 -2.995 2.453 -3.056 4.38l-.002 .182l-.243 -.023c-2.392 -.269 -4.498 -1.512 -5.944 -3.531a1 1 0 0 0 -1.685 .092l-.097 .186l-.049 .099c-.719 1.485 -1.19 3.29 -1.017 5.203l.03 .273c.283 2.263 1.5 4.215 3.779 5.679l.173 .107l-.081 .043c-1.315 .663 -2.518 .952 -3.827 .9c-1.056 -.04 -1.446 1.372 -.518 1.878c3.598 1.961 7.461 2.566 10.792 1.6c4.06 -1.18 7.152 -4.223 8.335 -8.433l.127 -.495c.238 -.993 .372 -2.006 .401 -3.024l.003 -.332l.393 -.779l.44 -.862l.214 -.434l.118 -.247c.265 -.565 .456 -1.033 .574 -1.43l.014 -.056l.008 -.018c.22 -.593 -.166 -1.358 -.941 -1.358l-.122 .007a.997 .997 0 0 0 -.231 .057l-.086 .038a7.46 7.46 0 0 1 -.88 .36l-.356 .115l-.271 .08l-.772 .214c-1.336 -1.118 -3.144 -1.254 -5.012 -.554l-.211 .084z"
            strokeWidth="0"
            fill="currentColor"
          />
        </svg>
      )
    default:
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="icon icon-tabler icon-tabler-world text-blue-700"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          strokeWidth="2"
          stroke="currentColor"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
          <path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0" />
          <path d="M3.6 9h16.8" />
          <path d="M3.6 15h16.8" />
          <path d="M11.5 3a17 17 0 0 0 0 18" />
          <path d="M12.5 3a17 17 0 0 1 0 18" />
        </svg>
      )
  }
}

function ProfileTopCard({ user }: { user: UserI }) {
  const getRoleColor = (role: string) => {
    switch (role) {
      case 'Admin':
        return 'text-red-600'
      case 'owner':
        return 'text-purple-600'
      case 'Editor':
        return 'text-green-500'
      case 'Writer':
        return 'text-teal-500'
      default:
        return 'text-blue-600'
    }
  }

  return (
    <div>
      <div className="flex flex-col items-center md:flex-row">
        {/* Profile Picture */}
        <div className="self-center p-2 md:self-start">
          <div className="m-1 h-32  w-32 overflow-hidden rounded-full border-2 border-gray-400  md:h-44 md:w-44">
            <Image
              width={5000}
              height={5000}
              // fill
              src={`
                  ${user.picturePath !== 'default.webp' ? `http://localhost:8080/assets/${user.username}/${user.picturePath}` : `http://localhost:8080/assets/${user.picturePath}`}
                  `}
              alt={user.username}
            />
          </div>
        </div>
        <div className="flex-2">
          {/* Username & Role */}
          <div className="flex items-center justify-center gap-2">
            <h1 className="text-2xl font-medium">{user.username}</h1>
            <Breaker type="between" />
            <p className={`text-xl font-medium ${getRoleColor(user.role)}`}>
              {user.role}
            </p>
          </div>

          <Breaker type="under" />

          <div className="flex w-[98%] flex-col items-center py-2">
            {/* Bio */}
            <h2 className="text-center text-xl font-medium underline">Bio</h2>
            <p className="w-full border-x border-gray-200 px-2 py-1  text-base leading-5 md:text-lg">
              {user.bio}
            </p>
          </div>
        </div>
      </div>

      {/* User Stats */}
      <div className="flex flex-wrap justify-center gap-1 bg-gray-100 p-2 text-sm">
        {/* TODO: Create Portal for followers and Followings webdebsimplified */}
        <p>Followers: {user.followers.length}</p>
        <Breaker type="between" />
        <p>Following: {user.following.length}</p>
        <Breaker type="between" />
        <p>Favorited Stories: {user.favoritedStories.length}</p>
        <Breaker type="between" />
        <p>Language: {user.language}</p>
        <Breaker type="between" />
        <p> Profile Views: {user.profileViews.total}</p>
      </div>

      {/* User Links */}
      {user.externalLinks.length > 0 && (
        <div className="flex flex-col items-center bg-gray-100 p-2 md:gap-1">
          <p className="text-lg underline">Links</p>
          <div className="flex flex-wrap gap-3">
            {user.externalLinks.map((link) => (
              <Link
                key={link.href}
                href={
                  link.href.startsWith('http')
                    ? link.href
                    : `https://${link.href}`
                }
                rel="noopener noreferrer"
                target="_blank"
                className="flex items-center gap-1"
              >
                <div>{GetLinkIcon(link.type)}</div>
                <p className="hover:text-blue-600">{link.type}</p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default ProfileTopCard
