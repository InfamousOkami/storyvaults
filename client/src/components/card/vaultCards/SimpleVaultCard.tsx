import { VaultContext } from '@/lib/VaultProvider'
import { useAppSelector } from '@/lib/redux/store'
import { VaultI } from '@/typings'
import axios from 'axios'
import Image from 'next/image'
import Link from 'next/link'
import React, { useContext, useEffect, useState } from 'react'

function SimpleVaultCard({ vault }: { vault: VaultI }) {
  const token = useAppSelector((state) => state.auth.token)
  const user = useAppSelector((state) => state.auth.user)

  const [active, setActive] = useState(false)
  const [followAmount, setFollowAmount] = useState(vault.followers.length)

  const [favoritesAmount, setFavoritesAmount] = useState(
    vault.favorites ? Object.keys(vault.favorites).length : 0
  )

  const { vaults, SetVaults } = useContext(VaultContext)

  const [isFollowed, setIsFollowed] = useState(
    token ? vault.followers.includes(user._id) : false
  )
  const [isFavorited, setisFavorited] = useState(
    token ? vault.followers.includes(user._id) : false
  )

  const [toggleAvailible, setToggleAvailible] = useState(true)

  const toggleFollow = async () => {
    setToggleAvailible(false)
    if (toggleAvailible) {
      if (isFollowed) {
        await axios.patch(
          `http://localhost:8080/api/v1/vault/follow/${vault._id}`,
          {},
          {
            headers: {
              Authorization: 'Bearer ' + token,
            },
          }
        )

        const newVaults = vaults.filter((v) => v._id !== vault._id)

        setIsFollowed(false)
        setFollowAmount((prev) => prev - 1)
        SetVaults(newVaults)
      } else {
        await axios.patch(
          `http://localhost:8080/api/v1/vault/follow/${vault._id}`,
          {},
          {
            headers: {
              Authorization: 'Bearer ' + token,
            },
          }
        )
        setIsFollowed(true)
        setFollowAmount((prev) => prev + 1)

        SetVaults([vault, ...vaults])
      }
    }
  }

  const toggleFavorite = async () => {
    setToggleAvailible(false)
    if (toggleAvailible) {
      if (isFavorited) {
        await axios.patch(
          `http://localhost:8080/api/v1/vault/favorite/${vault._id}`,
          {},
          {
            headers: {
              Authorization: 'Bearer ' + token,
            },
          }
        )

        setisFavorited(false)
        setFavoritesAmount((prev) => prev - 1)
      } else {
        await axios.patch(
          `http://localhost:8080/api/v1/vault/favorite/${vault._id}`,
          {},
          {
            headers: {
              Authorization: 'Bearer ' + token,
            },
          }
        )
        setisFavorited(true)
        setFavoritesAmount((prev) => prev + 1)
      }
    }
  }

  useEffect(() => {
    setTimeout(() => {
      setToggleAvailible(true)
    }, 5000)
  }, [toggleAvailible])

  return (
    <div
      className={`transition delay-0 duration-300 ease-in-out ${
        active ? `bg-pink-400` : 'bg-white'
      } relative m-auto h-36 w-full rounded-lg border  border-gray-300 shadow-md shadow-gray-300 md:mx-0 md:h-44 lg:w-[49%] xl:w-[32%]`}
      onMouseEnter={() => setActive(true)}
      onMouseLeave={() => setActive(false)}
    >
      <div className="relative flex h-full gap-2">
        {/* Left flex - Image */}
        <div className="relative flex-1">
          <Link className="relative" href={`/vault/${vault._id}`}>
            <div
              className={`relative h-full w-24 cursor-pointer overflow-hidden rounded-lg ${vault.picturePath !== '' ? '' : 'bg-blue-500'} p-1 shadow-sm shadow-gray-600 drop-shadow-lg hover:shadow-lg md:w-32`}
            >
              <Image
                fill
                priority={true}
                placeholder="empty"
                src={`http://localhost:8080/assets/${vault.userId.username}/${vault.picturePath}`}
                alt={vault.picturePath ? vault.picturePath : vault.name}
              />
            </div>
          </Link>
        </div>

        {/* Right Flex  */}
        <div className="flex-2 relative flex h-full w-full flex-col self-start">
          {/* Username & Name */}
          <div className="flex h-full flex-col justify-between">
            {/* Name & Username */}
            <div className="text-md flex h-fit items-center gap-2 md:text-lg">
              <Link href={`/vault/${vault._id}`}>
                <h1
                  className={`text-xl font-bold hover:text-blue-600 ${
                    active ? 'text-white' : ''
                  }`}
                >
                  {vault.name}
                </h1>
              </Link>
              <Link
                className="flex gap-1"
                href={`/profile/${vault.userId.username}`}
              >
                <p>By:</p>
                <p className="font-medium text-blue-600">
                  {vault.userId.username}
                </p>
              </Link>
              {/* Vault Amount */}
              <p>
                Stories:
                <span> {vault.stories.length}</span>
              </p>
            </div>
          </div>
          {/* Bottom flex - Information */}
          <div className="h-full text-xs text-gray-800 md:text-sm">
            {/* Dates */}
            <div
              className={`absolute bottom-1 left-0 flex flex-col leading-4 ${
                active ? 'text-white' : ''
              }`}
            >
              {/* Updated At */}
              <p>
                Updated:
                {/* @ts-ignore */}
                <span> {vault.updatedAt}</span>
              </p>

              {/* Created At */}
              <p>
                Created:
                {/*@ts-ignore*/}
                <span> {vault.createdAt}</span>
              </p>
            </div>

            {/* Bottom Right: Favoites & Follows */}
            <div
              className={`absolute bottom-1 right-2 ${
                active ? 'text-white' : ''
              }`}
            >
              {/* Follow Amount  */}
              <p className="flex items-center gap-1">
                {vault.userId._id !== user._id ? (
                  <div
                    onClick={() => {
                      toggleFollow()
                    }}
                  >
                    {isFollowed ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="icon icon-tabler icon-tabler-bookmark-filled cursor-pointer text-blue-500 hover:text-blue-600"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                        <path
                          d="M14 2a5 5 0 0 1 5 5v14a1 1 0 0 1 -1.555 .832l-5.445 -3.63l-5.444 3.63a1 1 0 0 1 -1.55 -.72l-.006 -.112v-14a5 5 0 0 1 5 -5h4z"
                          strokeWidth="0"
                          fill="currentColor"
                        />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="icon icon-tabler icon-tabler-bookmark cursor-pointer text-blue-500 hover:text-blue-600"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                        <path d="M18 7v14l-6 -4l-6 4v-14a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4z" />
                      </svg>
                    )}
                  </div>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="icon icon-tabler icon-tabler-bookmark-filled text-blue-500 hover:text-blue-600"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                    <path
                      d="M14 2a5 5 0 0 1 5 5v14a1 1 0 0 1 -1.555 .832l-5.445 -3.63l-5.444 3.63a1 1 0 0 1 -1.55 -.72l-.006 -.112v-14a5 5 0 0 1 5 -5h4z"
                      strokeWidth="0"
                      fill="currentColor"
                    />
                  </svg>
                )}
                <span> {followAmount}</span>
              </p>

              {/* Favorites */}
              <p
                className={`flex items-center gap-1 `}
                onClick={toggleFavorite}
              >
                {isFavorited ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="icon icon-tabler icon-tabler-star-filled cursor-pointer text-yellow-500 hover:text-yellow-600"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                    <path
                      d="M8.243 7.34l-6.38 .925l-.113 .023a1 1 0 0 0 -.44 1.684l4.622 4.499l-1.09 6.355l-.013 .11a1 1 0 0 0 1.464 .944l5.706 -3l5.693 3l.1 .046a1 1 0 0 0 1.352 -1.1l-1.091 -6.355l4.624 -4.5l.078 -.085a1 1 0 0 0 -.633 -1.62l-6.38 -.926l-2.852 -5.78a1 1 0 0 0 -1.794 0l-2.853 5.78z"
                      strokeWidth="0"
                      fill="currentColor"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="icon icon-tabler icon-tabler-star cursor-pointer text-yellow-500 hover:text-yellow-600"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                    <path d="M12 17.75l-6.172 3.245l1.179 -6.873l-5 -4.867l6.9 -1l3.086 -6.253l3.086 6.253l6.9 1l-5 4.867l1.179 6.873z" />
                  </svg>
                )}
                <p>{favoritesAmount}</p>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SimpleVaultCard
