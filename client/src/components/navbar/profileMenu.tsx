import { VaultContext } from '@/lib/VaultProvider'
import { logOut } from '@/lib/redux/features/auth-slice'
import { AppDispatch, useAppSelector } from '@/lib/redux/store'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useContext } from 'react'
import { useDispatch } from 'react-redux'

function ProfileMenu({ closeMenus }: { closeMenus: any }) {
  const user = useAppSelector((state) => state.auth.user)

  const { vaults, SetVaults } = useContext(VaultContext)

  const dispatch = useDispatch<AppDispatch>()
  const router = useRouter()

  const profileMenuLinks = [
    {
      name: 'My Profile',
      link: `/profile/${user.username}`,
      isWriter: false,
      isEditor: false,
      isAdmin: false,
      isOwner: false,
    },
    {
      name: 'My Stories',
      link: '/profile/myStories',
      isWriter: true,
      isEditor: true,
      isAdmin: true,
      isOwner: true,
    },
    {
      name: 'My Vaults',
      link: '/profile/myVaults',
      isWriter: false,
      isEditor: false,
      isAdmin: false,
      isOwner: false,
    },
    {
      name: 'My Editing Stories',
      link: '/profile/myEditorStories',
      isWriter: false,
      isEditor: true,
      isAdmin: true,
      isOwner: true,
    },
    {
      name: 'My Bookmarks',
      link: '/profile/myBookmarks',
      isWriter: false,
      isEditor: false,
      isAdmin: false,
      isOwner: false,
    },
    {
      name: 'Settings',
      link: '/profile/settings',
      isWriter: false,
      isEditor: false,
      isAdmin: false,
      isOwner: false,
    },
  ]

  const hasRequiredRole = (link: any) => {
    switch (link.name) {
      case 'My Stories':
        return (
          user.role === 'Writer' ||
          user.role === 'Editor' ||
          user.role === 'Admin' ||
          user.role === 'Owner'
        )
      case 'My Editing Stories':
        return (
          user.role === 'Editor' ||
          user.role === 'Admin' ||
          user.role === 'Owner'
        )

      default:
        return true // By default, allow all other links
    }
  }

  return (
    <div className="z-[500]">
      {profileMenuLinks
        .filter((link) => hasRequiredRole(link))
        .map((link, i) => (
          <Link key={link.name} onClick={closeMenus} href={link.link}>
            <p
              className={`cursor-pointer border-b-2 border-blue-900 bg-blue-700 px-3 py-2 hover:bg-blue-800`}
            >
              {link.name}
            </p>
          </Link>
        ))}
      <p
        className="cursor-pointer` bg-blue-700 px-3 py-2 hover:bg-blue-800"
        onClick={() => {
          SetVaults([])
          dispatch(logOut())
          router.push('/')
        }}
      >
        Logout
      </p>
    </div>
  )
}

export default ProfileMenu
