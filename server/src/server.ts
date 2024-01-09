import express from "express";
import http from "http";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import compression from "compression";
import cors from "cors";
import mongoose from "mongoose";
import morgan from "morgan";

import AppError from "./utils/appError";
import globalErrorHandler from "./Controllers/errorController";

import router from "./Routes";

require("dotenv").config();

const app = express();

app.use(
  cors({
    credentials: true,
  })
);

app.use(morgan("dev"));
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
app.use("/", router());

// If server cant find route
app.all("*", (req, res, next) => {
  return next(
    new AppError(`Can't find ${req.originalUrl} on this server`, 404)
  );
});

app.use(globalErrorHandler);

module.exports = app;
