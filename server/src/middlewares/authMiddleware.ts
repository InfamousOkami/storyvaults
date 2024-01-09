import express from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { promisify } from "util";

import { UserModel } from "../Models/userModel";
import AppError from "../utils/appError";
import catchAsync from "../utils/catchAsync";

interface CustomRequest extends express.Request {
  user?: any;
}

// export const isOwner = async (
//   req: express.Request,
//   res: express.Response,
//   next: express.NextFunction
// ) => {
//   try {
//     const { id } = req.params;
//     // const currentUserId = get(req, "identity._id") as string | undefined;

//     console.log(currentUserId);

//     if (!currentUserId) {
//       return res.status(403).json({ error: "Not logged in" });
//     }

//     if (currentUserId.toString() !== id) {
//       return res
//         .status(403)
//         .json({ error: "You do not have permission to access this" });
//     }

//     next();
//   } catch (error) {
//     console.log(error);

//     return res.status(400);
//   }
// };

export const isAuthenticated = catchAsync(
  async (
    req: CustomRequest,
    res: express.Response,
    next: express.NextFunction
  ) => {
    // 1. Get token and check if its there
    let token: string = "";

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      next(
        new AppError("You are not logged in! Please login to access this", 404)
      );
    }
    // 2. Verify token
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);

    if (!decoded) {
      next(new AppError("Invalid token, Please log in again!", 401));
    }

    // 3. Check if user still exists
    const freshUser = await UserModel.findById(decoded.id);

    if (!freshUser) {
      return next(
        new AppError("The user belonging to this token no longer exists", 401)
      );
    }

    console.log(freshUser);

    // 4. Check if user changed password after the token is issued

    if ((freshUser as any).changedPasswordAfter(decoded.iat)) {
      return next(
        new AppError(
          "User recently changed password! Please log in again.",
          401
        )
      );
    }

    req.user = freshUser;

    return next();
  }
);
