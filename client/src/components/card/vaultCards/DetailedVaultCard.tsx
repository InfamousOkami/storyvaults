import { VaultI } from '@/typings'
import Link from 'next/link'
import Breaker from '../../breaker/Breaker'
import Image from 'next/image'
import axios from 'axios'
import { useAppSelector } from '@/lib/redux/store'
import { useContext, useEffect, useState } from 'react'
import { VaultContext } from '@/lib/VaultProvider'

function DetailedVaultCard({ vault }: { vault: VaultI }) {
  const token = useAppSelector((state) => state.auth.token)
  const user = useAppSelector((state) => state.auth.user)

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
    <div className=" border  border-gray-200 bg-gray-100">
      <div className="m-1 flex gap-2 p-1">
        {/* Left flex - Image */}
        <div className=" flex-1 ">
          <div
            className={`h-36 w-24 cursor-pointer overflow-hidden  rounded-lg hover:shadow-lg md:h-80 md:w-56 ${vault.picturePath !== '' ? 'shadow-sm shadow-gray-600 drop-shadow-lg' : 'bg-gray-500 shadow-sm shadow-gray-600 drop-shadow-lg'}`}
          >
            <Image
              width={500}
              height={500}
              priority={true}
              placeholder="empty"
              src={`http://localhost:8080/assets/${vault.userId.username}/${vault.picturePath}`}
              alt={vault.picturePath ? vault.picturePath : vault.name}
            />
          </div>
        </div>

        {/* Right Flex - Name, username, description */}
        <div className="flex-2 w-full self-start">
          {/* Name & Username */}
          <div className="text-md flex gap-2 md:text-lg">
            <h1 className=" mb-1 border-b border-gray-400 text-xl font-semibold">
              {vault.name}
            </h1>

            <Link
              className="flex gap-1"
              href={`/profile/${vault.userId.username}`}
            >
              <p>By:</p>
              <p className="text-blue-700">{vault.userId.username}</p>
            </Link>
          </div>

          {/* Description */}
          <div className="border-x border-gray-200 px-2">
            <p className="text-xs md:text-lg md:leading-6">
              {vault.description}
            </p>
          </div>
        </div>
      </div>

      {/* Bottom flex - Information */}
      <div className="flex justify-between gap-1 bg-gray-200">
        <div className=" flex flex-wrap items-center gap-[.2rem]  p-2 text-xs leading-3 text-gray-800 md:gap-[.4rem] md:text-sm">
          {/* Vault Amount */}
          <p>
            Stories:
            <span> {vault.stories.length}</span>
          </p>
          <Breaker type="between" />

          {/* Favorites */}

          <p>
            Favorites:
            <span> {favoritesAmount}</span>
          </p>
          <Breaker type="between" />

          {/* Followers Amount  */}
          <p>
            Followers:
            <span> {followAmount}</span>
          </p>
          <Breaker type="between" />

          {/* Updated At */}
          <p>
            Updated:
            {/*@ts-ignore*/}
            <span> {vault.updatedAt}</span>
          </p>
          <Breaker type="between" />

          {/* Created At */}
          <p>
            Created:
            {/*@ts-ignore*/}
            <span> {vault.createdAt}</span>
          </p>
        </div>
        <div className="flex flex-col gap-1 md:flex-row">
          <div className="flex items-center gap-1 self-end">
            {/* Favorite Button */}
            {token ? (
              <div
                className=" cursor-pointer rounded-lg p-1 text-center text-white"
                onClick={toggleFavorite}
              >
                {isFavorited ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="icon icon-tabler icon-tabler-star-filled text-yellow-500 hover:text-yellow-600"
                    width="48"
                    height="48"
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
                    className="icon icon-tabler icon-tabler-star text-yellow-500 hover:text-yellow-600"
                    width="48"
                    height="48"
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
              </div>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="icon icon-tabler icon-tabler-star-filled text-yellow-500 hover:text-yellow-600"
                width="48"
                height="48"
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
            )}

            {/* Bookmark Button */}
            <div className=" cursor-pointer rounded-lg p-1 text-center text-white ">
              {/* bookmark */}
              {vault.userId._id !== user._id && token ? (
                <div
                  onClick={() => {
                    toggleFollow()
                  }}
                >
                  {isFollowed ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="icon icon-tabler icon-tabler-bookmark-filled text-blue-500 hover:text-blue-600"
                      width="48"
                      height="48"
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
                      className="icon icon-tabler icon-tabler-bookmark text-blue-500 hover:text-blue-600"
                      width="48"
                      height="48"
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
                  width="48"
                  height="48"
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
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DetailedVaultCard
