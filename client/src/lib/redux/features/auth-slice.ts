import { BookmarkI, UserI, externalLinksI } from '@/typings'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

type InitialStateT = {
  user: AuthStateT
  token: string | null
  bookmarks: BookmarkI[]
}

type AuthStateT = {
  username: string
  _id: string
  email: string
  picturePath: string
  bio: string
  role: string
  followers: string[]
  following: string[]
  favoritedStories: string[]
  language: string
  externalLinks: externalLinksI[]
  theme: string
  adultContent: boolean
  tosAccepted: boolean
  profileViews: {
    total: number
    monthlyCount: number
    lastUpdated: Date
  } | null
  active: boolean
}

const initialState = {
  user: {
    username: '',
    _id: '',
    email: '',
    picturePath: '',
    bio: '',
    role: '',
    followers: [],
    following: [],
    favoritedStories: [],
    language: '',
    externalLinks: [],
    theme: 'dark',
    adultContent: false,
    tosAccepted: false,
    profileViews: null,
    active: false,
  } as AuthStateT,
  token: null,
  bookmarks: [],
} as InitialStateT

export const auth = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logOut: () => {
      return initialState
    },

    logIn: (
      state,
      action: PayloadAction<{
        user: UserI
        token: string
        bookmarks: BookmarkI[]
      }>
    ) => {
      const { user, token, bookmarks } = action.payload
      return {
        user: {
          username: user.username,
          _id: user._id,
          email: user.email,
          picturePath: user.picturePath,
          bio: user.bio,
          role: user.role,
          followers: user.followers,
          following: user.following,
          favoritedStories: user.favoritedStories,
          language: user.language,
          externalLinks: user.externalLinks,
          theme: user.theme,
          adultContent: user.adultContent,
          tosAccepted: user.tosAccepted,
          profileViews: user.profileViews,
          active: user.active,
        },
        token: token,
        bookmarks: bookmarks,
      }
    },

    setUserSettings: (
      state,
      action: PayloadAction<{
        user: UserI
      }>
    ) => {
      const { user } = action.payload
      return {
        ...state,
        user: {
          ...state.user,
          bio: user.bio,
          role: user.role,
          language: user.language,
          // externalLinks: user.externalLinks,
          theme: user.theme,
          adultContent: user.adultContent,
          tosAccepted: user.tosAccepted,
        },
      }
    },

    setBookmarks: (
      state,
      action: PayloadAction<{
        bookmarks: BookmarkI[]
      }>
    ) => {
      const { bookmarks } = action.payload
      return {
        ...state,
        bookmarks: bookmarks,
      }
    },

    setFollowing: (
      state,
      action: PayloadAction<{
        following: any
      }>
    ) => {
      const { following } = action.payload
      return {
        ...state,
        user: {
          ...state.user,
          following: following,
        },
      }
    },
  },
})

export const { logIn, logOut, setUserSettings, setBookmarks, setFollowing } =
  auth.actions
export default auth.reducer
