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

require("dotenv").config();

const app = express();

app.use(
  cors({
    credentials: true,
  })
);

// Global Middleware
// Set security Headers
app.use(helmet());

// Dev Logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Limit Request from same Ip
const limiter = ratelimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: "To many requests from this IP, please try again in an hour!",
});
app.use("/api", limiter);

// Data sanitization, Removes $ and .'s, Stops noSQL injections
app.use(mongoSanitize());

// Body Parser
app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());

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

// Routes
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/stories", storyRoutes);
app.use("/api/v1/category", categoryRoutes);
app.use("/api/v1/language", languageRoutes);
app.use("/api/v1/genre", genreRoutes);
app.use("/api/v1/chapter", chapterRoutes);
app.use("/api/v1/comment", commentRoutes);

// If server cant find route
app.all("*", (req, res, next) => {
  return next(
    new AppError(`Can't find ${req.originalUrl} on this server`, 404)
  );
});

app.use(globalErrorHandler);

module.exports = app;
