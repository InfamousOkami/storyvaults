import mongoose, { Document } from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";
import { Timestamp } from "mongodb";

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

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "Please provide a valid email"],
  },
  photo: String,
  password: {
    type: String,
    required: [true, "Please provide a password"],
    select: false,
    minlength: 8,
  },
  passwordConfirm: {
    type: String,
    required: [true, "Please confirm your password"],
    select: false,
    default: undefined,
    validate: {
      validator: function (this: Document, el: string | undefined) {
        // Explicitly check if el is not undefined before comparing
        return el !== undefined && el === this.get("password");
      },
      message: "Passwords do not match",
    },
  },
  picturePath: { type: String, default: "default.png" },
  bio: { type: String, default: "" },
  role: {
    type: String,
    enum: ["Reader", "Writer", "Editor", "Admin", "Owner"],
    default: "Reader",
  },
  followers: {
    type: Array<string>,
    default: [],
  },
  following: {
    type: Array<string>,
    default: [],
  },
  language: { type: String, default: "english" },
  externalLinks: { type: Array<externalLinksI>, default: [] },
  theme: {
    type: String,
    enum: ["dark", "light"],
  },
  adultContent: {
    type: Boolean,
    default: false,
  },
  tosAccepted: {
    type: Boolean,
    default: false,
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  profileViews: {
    type: Number,
    default: 0,
  },
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
});

UserSchema.pre("save", async function (next) {
  // Runs Function if Password is modified
  if (!this.isModified("password")) return next();

  // Hash the password with cost 12
  this.password = await bcrypt.hash(this.password, 12);

  // Delete passwordConfirm
  this.set("passwordConfirm", undefined);

  next();
});

UserSchema.methods.correctPassword = async function (
  enteredPassword: string,
  userPassword: string
) {
  return await bcrypt.compare(enteredPassword, userPassword);
};

UserSchema.methods.changedPasswordAfter = function (JWTTimestamp: any) {
  if (this.passwordChangedAt) {
    const changedTimestamp = this.passwordChangedAt.getTime() / 1000;

    return JWTTimestamp < changedTimestamp;
  }
  return false;
};

export const UserModel = mongoose.model("user", UserSchema);
