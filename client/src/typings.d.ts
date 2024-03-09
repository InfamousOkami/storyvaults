type externalLinksType =
  | 'twitter'
  | 'instagram'
  | 'youtube'
  | 'linktree'
  | 'other'

interface externalLinksI {
  type: externalLinksType
  href: string
}

export interface UserI extends Document {
  username: string
  email: string
  password?: string
  passwordConfirm?: string
  picturePath: string
  bio: string
  role: 'Reader' | 'Writer' | 'Editor' | 'Admin' | 'Owner'
  followers: string[]
  following: string[]
  favoritedStories: string[]
  language: string
  externalLinks: externalLinksI[]
  theme: 'dark' | 'light'
  adultContent: boolean
  tosAccepted: boolean
  passwordChangedAt?: Date
  passwordResetToken?: string
  passwordResetExpires?: Date
  profileViews: {
    total: number
    monthlyCount: number
    lastUpdated: Date
  }
  active: boolean
  _id: string

  // Methods
  correctPassword(
    enteredPassword: string,
    userPassword: string
  ): Promise<boolean>
  changedPasswordAfter(JWTTimestamp: any): boolean
  createPasswordResetToken(): string
}

type readerAccessT = 'free' | 'payFull' | 'payByChapter'
type editorRequestT = 'Declined' | 'Accepted' | 'Pending' | 'None'
type statusT = 'Complete' | 'Incomplete'

export interface StoryI extends Document {
  _id: string
  title: string
  description: string
  views: {
    total: number
    monthlyCount: number
    weeklyCount: number
    lastWeekluUpdated: Date
    lastMonthlyUpdated: Date
  }
  active: boolean
  readerAccess: readerAccessT
  price: number
  slug: string
  category: mongoose.Schema.Types.ObjectId
  userId: mongoose.Schema.Types.ObjectId
  editorId?: mongoose.Schema.Types.ObjectId | null
  editorRequestStatus: editorRequestT
  picturePath?: string
  pictureName?: string
  status: statusT
  nsfw: boolean
  ratingsAverage: {
    total: number
    monthlyCount: number
    weeklyCount: number
    lastMonthlyUpdated: Date
    lastWeeklyUpdated: Date
  }
  languageName: mongoose.Schema.Types.ObjectId
  genre: mongoose.Schema.Types.ObjectId
  chapterAmount: number
  wordAmount: number
  commentAmount: number
  bookmarkAmount: {
    total: number
    monthlyCount: number
    weeklyCount: number
    lastMonthUpdated: Date
    lastWeekUpdated: Date
  }
  favorites: Map<string, boolean>
  favoriteAmount: {
    total: number
    monthlyCount: number
    weeklyCount: number
    lastMonthUpdated: Date
    lastWeekUpdated: Date
  }
  createdAt: Date
  updatedAt: Date
}

export interface CategoryI extends Document {
  name: string
  description?: string
  storyAmount: number
  _id: string
}

export interface GenreI extends Document {
  name: string
  _id: string
  storyAmount: {
    total: number
    book: number
    oneShot: number
    lightNovel: number
  }
}

export interface LanguageI extends Document {
  name: string
  storyAmount: number
  _id: string
}

export interface ChapterI extends Document {
  name: string
  views: {
    total: number
    monthlyCount: number
    weeklyCount: number
    lastWeekluUpdated: Date
    lastMonthlyUpdated: Date
  }
  chapterNumber: number
  storyId: mongoose.Schema.Types.ObjectId
  userId: mongoose.Schema.Types.ObjectId
  chapterContent: string
  chapterContentWords: string
  wordCount: number
  createdAt: Date
  updatedAt: Date
  needEditing: boolean
  price: number
  likes: Map<mongoose.Schema.Types.ObjectId, boolean>
  _id: string
}

export interface VaultI extends Document {
  name: string
  description: string
  userId: mongoose.Schema.Types.ObjectId
  stories: string[]
  followers: string[]
  favorites: Map<string, boolean>
  picturePath: string
  pictureName: string
  createdAt: Date
  updatedAt: Date
  _id: string
}

export interface PostI extends Document {
  userId: mongoose.Schema.Types.ObjectId
  subject: string
  backgroundColor: string
  textColor: string
  borderColor: string
  postContent: string
  likes: Map<mongoose.Schema.Types.ObjectId, boolean>
  createdAt: Date
  updatedAt: Date
  _id: string
}

export interface BookmarkI extends Document {
  storyId: mongoose.Schema.Types.ObjectId
  userId: mongoose.Schema.Types.ObjectId
  chapterNumber: number
  authorUsername: string
  createdAt: Date
  updatedAt: Date
  _id: string
}
