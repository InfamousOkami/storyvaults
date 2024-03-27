import express from "express";
import http from "http";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import compression from "compression";
import cors from "cors";
import mongoose from "mongoose";
import morgan from "morgan";
import ratelimit from "express-rate-limit";
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";
import fs from "fs";
import { fileURLToPath } from "url";
import path from "path";

import multer from "multer";
import methodOverride from "method-override";

import AppError from "./utils/appError";
import globalErrorHandler from "./Controllers/errorController";

import userRoutes from "./Routes/usersRoutes";
import authRoutes from "./Routes/authRoutes";
import storyRoutes from "./Routes/storyRoutes";
import categoryRoutes from "./Routes/categoryRoutes";
import languageRoutes from "./Routes/languageRoutes";
import genreRoutes from "./Routes/genreRoutes";
import chapterRoutes from "./Routes/chapterRoutes";
import commentRoutes from "./Routes/commentRoutes";
import postRoutes from "./Routes/postRoutes";
import vaultRoutes from "./Routes/vaultRoutes";
import bookmarkRoutes from "./Routes/bookmarkRoutes";

import { CustomRequest } from "../typings";
import { createStory, updateStory } from "./Controllers/storyController";
import {
  isAuthenticated,
  isOwnerOrAdmin,
  restricToRoles,
} from "./middlewares/authMiddleware";
import { createVault, updateVault } from "./Controllers/vaultController";
import { updateMe } from "./Controllers/userController";

require("dotenv").config();

const app = express();

app.use(
  cors({
    origin: ["https://storyvaults-server.vercel.app"],
    methods: ["get", "post"],
    credentials: true,
  })
);

// Global Middleware
// Set security Headers
app.use(helmet());

app.use(methodOverride("_method"));

// Dev Logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Limit Request from same Ip
// const limiter = ratelimit({
//   max: 100,
//   windowMs: 60 * 60 * 1000,
//   message: "To many requests from this IP, please try again in an hour!",
// });
// app.use("/api", limiter);

// Data sanitization, Removes $ and .'s, Stops noSQL injections
app.use(mongoSanitize());

// Body Parser
app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json({ limit: "50mb" }));

const server = http.createServer(app);

server.listen(process.env.PORT, () => {
  console.log("Server running on http://localhost:8080/");
});

const db = process.env.MONGO_URL!.replace(
  "<PASSWORD>",
  process.env.MONGO_PASSWORD!
);

mongoose.Promise = Promise;

if (!db) {
  console.error("MongoDB connection URL is undefined. Check your .env file.");

  server.close(() => {
    process.exit(1);
  });
}

mongoose.connect(db);

mongoose.connection.on("error", (error: Error) =>
  console.log("Error 🔥", error)
);

mongoose.connection.on("unhandledRejection", (error: Error) => {
  console.log(error.name, error.message);
  console.log("UNHANDLED REJECTION! 🔥 Shutting down!");

  server.close(() => {
    process.exit(1);
  });
});

mongoose.connection.on("uncaughtException", (error: Error) => {
  console.log(error.name, error.message);
  console.log("UNCAUGHT EXCEPTION! 🔥 Shutting down!");

  process.exit(1);
});

app.use("/assets", express.static(path.join(__dirname, "../public/assets")));

// Routes
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/stories", storyRoutes);
app.use("/api/v1/category", categoryRoutes);
app.use("/api/v1/language", languageRoutes);
app.use("/api/v1/genre", genreRoutes);
app.use("/api/v1/chapter", chapterRoutes);
app.use("/api/v1/comment", commentRoutes);
app.use("/api/v1/post", postRoutes);
app.use("/api/v1/vault", vaultRoutes);
app.use("/api/v1/bookmark", bookmarkRoutes);

const storage = multer.diskStorage({
  destination: function (req: CustomRequest, file, cb) {
    const directory = `public/assets/${req.user.username}`;
    // Check if the directory exists
    if (!fs.existsSync(directory)) {
      // If it doesn't exist, create it
      fs.mkdirSync(directory, { recursive: true });
    }
    cb(null, directory);
  },
  filename: function (req, file, cb) {
    cb(null, req.body.picturePath);
  },
});

const upload = multer({ storage: storage });

// Create
app.post(
  "/api/v1/stories/new",
  isAuthenticated,
  restricToRoles("Writer", "Editor", "Admin", "Owner"),
  upload.single("picture"),
  createStory
);

app.post(
  "/api/v1/vault/new",
  isAuthenticated,
  upload.single("picture"),
  createVault
);

// Update With Pictures
app.patch(
  "/api/v1/users/updateMe",
  isAuthenticated,
  isOwnerOrAdmin,
  upload.single("picture"),
  updateMe
);

app.patch(
  "/api/v1/stories/story/:id",
  isAuthenticated,
  upload.single("picture"),
  updateStory
);

app.patch(
  "/api/v1/vault/update/:id",
  isAuthenticated,
  upload.single("picture"),
  updateVault
);

// If server cant find route
app.all("*", (req, res, next) => {
  return next(
    new AppError(`Can't find ${req.originalUrl} on this server`, 404)
  );
});

app.use(globalErrorHandler);

module.exports = app;
