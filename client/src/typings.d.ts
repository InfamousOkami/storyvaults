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
