import { UserI, externalLinksI } from "@/typings";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type InitialStateT = {
  user: AuthStateT;
  token: string | null;
};

type AuthStateT = {
  username: string;
  email: string;
  picturePath: string;
  bio: string;
  role: string;
  followers: Map<string, boolean>;
  following: Map<string, boolean>;
  favoritedStories: Map<string, boolean>;
  language: string;
  externalLinks: externalLinksI[];
  theme: string;
  adultContent: boolean;
  tosAccepted: boolean;
  passwordChangedAt: Date;
  profileViews: number;
  active: boolean;
};

const initialState = {
  user: {
    username: "",
    email: "",
    picturePath: "",
    bio: "",
    role: "",
    followers: new Map<string, boolean>(),
    following: new Map<string, boolean>(),
    favoritedStories: new Map<string, boolean>(),
    language: "",
    externalLinks: [],
    theme: "dark",
    adultContent: false,
    tosAccepted: false,
    passwordChangedAt: new Date(),
    profileViews: 0,
    active: false,
  } as AuthStateT,
  token: null,
} as InitialStateT;

export const auth = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logOut: () => {
      return initialState;
    },
    logIn: (state, action: PayloadAction<{ user: UserI; token: string }>) => {
      const { user, token } = action.payload;
      return {
        user: {
          username: user.username,
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
          passwordChangedAt: user.passwordChangedAt,
          profileViews: user.profileViews,
          active: user.active,
        },
        token: token,
      };
    },
  },
});

export const { logIn, logOut } = auth.actions;
export default auth.reducer;
