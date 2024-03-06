'use client'
import Link from 'next/link'
import { mobileMenuLinks } from './menuLinks'
import { useAppSelector } from '@/lib/redux/store'
import Image from 'next/image'

const linkStyles = `py-2 px-3 hover:bg-blue-800 bg-blue-700 cursor-pointer`

function MobileMenu({ setProfileMenuOpen, profileMenuOpen, closeMenus }: any) {
  const token = useAppSelector((state) => state.auth.token)
  const user = useAppSelector((state) => state.auth.user)

  return (
    <div
      className={`z-[5000] ${profileMenuOpen ? 'border-l-2 border-blue-900' : ''}`}
    >
      {token ? (
        <div
          className={`${linkStyles} flex items-center justify-center gap-1 border-b-2 border-blue-900 py-1`}
          onClick={() => setProfileMenuOpen(!profileMenuOpen)}
        >
          <div className="h-8 w-8 overflow-hidden rounded-full  ">
            <Image
              width={32}
              height={32}
              src={`
                  ${user.picturePath !== 'default.webp' ? `http://localhost:8080/assets/${user.username}/${user.picturePath}` : `http://localhost:8080/assets/${user.picturePath}`}
                  `}
              alt={user.username}
            />
          </div>
          <p>{user.username}</p>
        </div>
      ) : (
        <Link href="/login">
          <p
            className={`cursor-pointer border-b-2 border-blue-900 bg-blue-700 px-3 py-2 hover:bg-blue-800 `}
          >
            Log In
          </p>
        </Link>
      )}
      {mobileMenuLinks.map((link, i) => (
        <Link key={link.name} onClick={closeMenus} href={link.link}>
          <p
            className={`${linkStyles} ${
              i === mobileMenuLinks.length - 1
                ? ``
                : `border-b-2 border-blue-900`
            }`}
          >
            {link.name}
          </p>
        </Link>
      ))}
    </div>
  )
}

export default MobileMenu
