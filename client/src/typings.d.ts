type externalLinksType =
  | "twitter"
  | "instagram"
  | "youtube"
  | "linktree"
  | "other";

interface externalLinksI {
  type: externalLinksType;
  href: string;
}

export interface UserI extends Document {
  username: string;
  email: string;
  password?: string;
  passwordConfirm?: string;
  picturePath: string;
  bio: string;
  role: "Reader" | "Writer" | "Editor" | "Admin" | "Owner";
  followers: string[];
  following: string[];
  favoritedStories: string[];
  language: string;
  externalLinks: externalLinksI[];
  theme: "dark" | "light";
  adultContent: boolean;
  tosAccepted: boolean;
  passwordChangedAt?: Date;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  profileViews: {
    total: number;
    monthlyCount: number;
    lastUpdated: Date;
  };
  active: boolean;

  // Methods
  correctPassword(
    enteredPassword: string,
    userPassword: string
  ): Promise<boolean>;
  changedPasswordAfter(JWTTimestamp: any): boolean;
  createPasswordResetToken(): string;
}

type readerAccessT = "free" | "payFull" | "payByChapter";
type editorRequestT = "Declined" | "Accepted" | "Pending" | "None";
type statusT = "Complete" | "Incomplete";

export interface StoryI extends Document {
  _id: string;
  title: string;
  description: string;
  active: boolean;
  readerAccess: readerAccessT;
  price: number;
  slug: string;
  category: mongoose.Schema.Types.ObjectId;
  userId: mongoose.Schema.Types.ObjectId;
  editorId?: mongoose.Schema.Types.ObjectId | null;
  editorRequestStatus: editorRequestT;
  picturePath?: string;
  status: statusT;
  ratingsAverage: number;
  languageName: mongoose.Schema.Types.ObjectId;
  genre: mongoose.Schema.Types.ObjectId;
  chapterAmount: number;
  wordAmount: number;
  commentAmount: number;
  bookmarkAmount: {
    total: number;
    monthlyCount: number;
    lastUpdated: Date;
  };
  favorites: Map<mongoose.Schema.Types.ObjectId, boolean>;
  favoriteAmount: {
    total: number;
    monthlyCount: number;
    lastUpdated: Date;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface CategoryI extends Document {
  name: string;
  description?: string;
  storyAmount: number;
}
