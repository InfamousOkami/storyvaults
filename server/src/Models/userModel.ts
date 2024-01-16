import mongoose, { Document } from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";
import crypto from "crypto";
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

export interface UserI extends Document {
  username: string;
  email: string;
  photo?: string;
  password: string;
  passwordConfirm?: string;
  picturePath: string;
  bio: string;
  role: "Reader" | "Writer" | "Editor" | "Admin" | "Owner";
  followers: string[];
  following: string[];
  language: string;
  externalLinks: externalLinksI[];
  theme?: "dark" | "light";
  adultContent: boolean;
  tosAccepted: boolean;
  passwordChangedAt?: Date;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  profileViews: number;
  active: boolean;

  // Methods
  correctPassword(
    enteredPassword: string,
    userPassword: string
  ): Promise<boolean>;
  changedPasswordAfter(JWTTimestamp: any): boolean;
  createPasswordResetToken(): string;
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

// Middleware
UserSchema.pre("save", async function (next) {
  // Runs Function if Password is modified
  if (!this.isModified("password")) return next();

  // Hash the password with cost 12
  this.password = await bcrypt.hash(this.password, 12);

  // Delete passwordConfirm
  this.set("passwordConfirm", undefined);

  next();
});

UserSchema.pre("save", function (next) {
  if (!this.isModified("password") || this.isNew) return next();

  this.set("passwordChangedAt", Date.now() - 1000);
  next();
});

UserSchema.pre(/^find/, function (this: any, next) {
  // Current query only finds users that are active
  // this.find({ active: true });
  console.log(this.find({ active: { $ne: false } }));
  next();
});

// Methods/Functions
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

UserSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");

  this.set(
    "passwordResetToken",
    crypto.createHash("sha256").update(resetToken).digest("hex")
  );

  console.log({ resetToken }, this.passwordResetToken);

  this.set("passwordResetExpires", Date.now() + 10 * 60 * 1000);

  return resetToken;
};

export const UserModel = mongoose.model("user", UserSchema);
