import { UserI, externalLinksI } from "@/typings";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type InitialStateT = {
  value: AuthStateT;
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

// type InitialState = {
//   value: AuthState;
// };

const initialState = {
  value: {
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
} as InitialStateT;

export const auth = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logOut: () => {
      return initialState;
    },
    logIn: (state, action: PayloadAction<UserI>) => {
      return {
        value: {
          username: action.payload.username,
          email: action.payload.email,
          picturePath: action.payload.picturePath,
          bio: action.payload.bio,
          role: action.payload.role,
          followers: action.payload.followers,
          following: action.payload.following,
          favoritedStories: action.payload.favoritedStories,
          language: action.payload.language,
          externalLinks: action.payload.externalLinks,
          theme: action.payload.theme,
          adultContent: action.payload.adultContent,
          tosAccepted: action.payload.tosAccepted,
          passwordChangedAt: action.payload.passwordChangedAt,
          profileViews: action.payload.profileViews,
          active: action.payload.active,
        },
      };
    },
  },
});

export const { logIn, logOut } = auth.actions;
export default auth.reducer;
