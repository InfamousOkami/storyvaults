import express from "express";
import AppError from "../utils/appError";

const handleCastErrorDB = (err: any) => {
  const message = `Invalid ${err.path}: ${err.value}.`;

  return new AppError(message, 404);
};

const handleDuplicateFieldsDB = (err: any) => {
  const value = err.keyValue[Object.keys(err.keyValue)[0]];
  const message = `Duplicate field value: ${value}. Please use another value.`;

  return new AppError(message, 400);
};

const handleValidationErrorsDB = (err: any) => {
  const errors = Object.values(err.errors).map((el: any) => el.message);
  const message = `Invalid input data. ${errors.join(". ")}`;

  return new AppError(message, 404);
};

const handleJWTError = () => {
  return new AppError("Invalid token. Please login again!", 401);
};

const handleJWTExpiredError = () => {
  return new AppError("Token has expired. Please login again!", 401);
};

const sendErrorDev = (err: any, res: express.Response) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProduction = (err: any, res: express.Response) => {
  // Opeational, trusted error: send message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
    // Programming error or other unknown error: don't leak error details
  } else {
    // 1. Log error
    console.error("Error 🔥", err);

    // 2. Send Generic Message
    res.status(500).json({
      status: "Error",
      message: "Something went wrong!",
    });
  }
};

export default (
  err: any,
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === "production") {
    let error = { ...err, name: err.name };

    if (error.name === "CastError") error = handleCastErrorDB(error);
    if (err.code === 11000) error = handleDuplicateFieldsDB(error);
    if (error.name === "ValidationError")
      error = handleValidationErrorsDB(error);

    if (error.name === "JsonWebTokenError") error = handleJWTError();
    if (error.name === "TokenExpiredError") error = handleJWTExpiredError();

    sendErrorProduction(error, res);
  }
};
