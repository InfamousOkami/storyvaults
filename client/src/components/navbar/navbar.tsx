'use client'
import { Bars3Icon } from '@heroicons/react/24/solid'
import { useEffect, useRef, useState } from 'react'
import ProfileMenu from './profileMenu'
import MobileMenu from './mobileMenu'
import { mobileMenuLinks } from './menuLinks'
import Link from 'next/link'
import { useAppSelector } from '@/lib/redux/store'
import Image from 'next/image'
import Bookmarks from '../bookmarks/Bookmarks'
import FollowedVaults from '../vaults/followedVaults/FollowedVaults'

function Navbar() {
  const token = useAppSelector((state) => state.auth.token)
  const user = useAppSelector((state) => state.auth.user)

  const [bookmarkOpen, setBookmarkOpen] = useState(false)
  const [vaultsOpen, setVaultsOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [profileMenuOpen, setProfileMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement | null>(null)
  const profileMenuRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const isOutsideMenu =
        menuRef.current && !menuRef.current.contains(event.target as Node)
      const isOutsideProfileMenu =
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target as Node)

      if (menuOpen && isOutsideMenu) {
        setMenuOpen(false)
      }

      if (profileMenuOpen && isOutsideProfileMenu) {
        setProfileMenuOpen(false)
      }

      if (bookmarkOpen) {
        setBookmarkOpen(false)
      }

      if (vaultsOpen) {
        setVaultsOpen(false)
      }
    }

    document.addEventListener('click', handleClickOutside)

    return () => {
      document.removeEventListener('click', handleClickOutside)
    }
  }, [
    menuOpen,
    profileMenuOpen,
    menuRef,
    profileMenuRef,
    bookmarkOpen,
    vaultsOpen,
  ])

  const toggleMenus = () => {
    if (menuOpen || profileMenuOpen) {
      setMenuOpen(false)
      setProfileMenuOpen(false)
    } else {
      setMenuOpen(!menuOpen)
    }
  }

  const toggleBookmarks = () => {
    if (bookmarkOpen) {
      setBookmarkOpen(false)
    } else {
      setBookmarkOpen(!menuOpen)
    }
  }

  const toggleVaults = () => {
    if (vaultsOpen) {
      setVaultsOpen(false)
    } else {
      setVaultsOpen(!menuOpen)
    }
  }

  const toggleProfileMenu = () => {
    setProfileMenuOpen(!profileMenuOpen)
  }

  // TODO: Add Bookmark list button

  return (
    <div
      className={`relative z-[500] flex w-full items-center justify-between bg-blue-600 px-2 py-3 shadow-sm shadow-blue-800 drop-shadow-lg`}
    >
      {/* Logo & Pages */}
      <div className="flex gap-5">
        <div className="w-[140px]">
          <p className="text-2xl font-bold text-gray-50">
            <Link href="/">
              Story
              <span className="text-blue-900">Vaults</span>
            </Link>
          </p>
        </div>

        {/* pages */}
        <div className="hidden gap-3 text-lg text-white md:flex ">
          {mobileMenuLinks.map((link) => (
            <Link key={link.name} href={link.link}>
              <p className="hover:text-gray-800">{link.name}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* Bookmarks, and user */}
      <div className="flex gap-3">
        <div className="flex gap-3">
          {/* Vaults */}
          <div className={`relative ${token ? '' : 'hidden'}`}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="icon icon-tabler icon-tabler-books cursor-pointer text-gray-100 hover:text-gray-300"
              width="32"
              height="32"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              onClick={toggleVaults}
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M5 4m0 1a1 1 0 0 1 1 -1h2a1 1 0 0 1 1 1v14a1 1 0 0 1 -1 1h-2a1 1 0 0 1 -1 -1z" />
              <path d="M9 4m0 1a1 1 0 0 1 1 -1h2a1 1 0 0 1 1 1v14a1 1 0 0 1 -1 1h-2a1 1 0 0 1 -1 -1z" />
              <path d="M5 8h4" />
              <path d="M9 16h4" />
              <path d="M13.803 4.56l2.184 -.53c.562 -.135 1.133 .19 1.282 .732l3.695 13.418a1.02 1.02 0 0 1 -.634 1.219l-.133 .041l-2.184 .53c-.562 .135 -1.133 -.19 -1.282 -.732l-3.695 -13.418a1.02 1.02 0 0 1 .634 -1.219l.133 -.041z" />
              <path d="M14 9l4 -1" />
              <path d="M16 16l3.923 -.98" />
            </svg>

            {vaultsOpen && <FollowedVaults />}
          </div>

          {/* Bookmarks */}
          <div className={`relative ${token ? '' : 'hidden'}`}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="icon icon-tabler icon-tabler-bookmark-filled cursor-pointer text-gray-100 hover:text-gray-300"
              width="32"
              height="32"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              onClick={toggleBookmarks}
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path
                d="M14 2a5 5 0 0 1 5 5v14a1 1 0 0 1 -1.555 .832l-5.445 -3.63l-5.444 3.63a1 1 0 0 1 -1.55 -.72l-.006 -.112v-14a5 5 0 0 1 5 -5h4z"
                strokeWidth="0"
                fill="currentColor"
              />
            </svg>

            {bookmarkOpen && <Bookmarks />}
          </div>
        </div>
        {/* User Links */}
        {token ? (
          <>
            <div
              className="hidden cursor-pointer items-center justify-end gap-2 md:flex"
              onClick={toggleProfileMenu}
            >
              <div className="h-8 w-8 overflow-hidden rounded-full ">
                <Image
                  width={100}
                  height={100}
                  src={`
                  ${user.picturePath !== 'default.webp' ? `http://localhost:8080/assets/${user.username}/${user.picturePath}` : `http://localhost:8080/assets/${user.picturePath}`}
                  `}
                  alt={user.username}
                />
              </div>
              <p className="text-white">{user.username}</p>
            </div>
            <div className="absolute right-0 top-14 hidden text-white md:block">
              {profileMenuOpen && (
                <div
                  ref={profileMenuRef}
                  className="relative  w-fit text-center"
                >
                  <ProfileMenu closeMenus={toggleMenus} />
                </div>
              )}
            </div>
          </>
        ) : (
          <Link
            className="hidden text-lg text-white hover:text-blue-950 md:block"
            href="/login"
          >
            Log In
          </Link>
        )}

        {/* Mobile Menu */}
        <div className="md:hidden" onClick={toggleMenus}>
          <Bars3Icon width={30} height={30} className="text-white" />
        </div>
        <div className="absolute right-0 top-14 flex text-white md:hidden">
          {profileMenuOpen && (
            <div ref={profileMenuRef} className="relative  w-fit text-center">
              <ProfileMenu closeMenus={toggleMenus} />
            </div>
          )}
          {menuOpen && (
            <div ref={menuRef} className="relative  w-fit text-center">
              <MobileMenu
                setProfileMenuOpen={setProfileMenuOpen}
                profileMenuOpen={profileMenuOpen}
                closeMenus={toggleMenus}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Navbar
