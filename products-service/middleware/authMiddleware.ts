import { Request, Response, NextFunction } from "express";
import jwt, { decode } from "jsonwebtoken";
import asyncHandler from "./asyncHanlder.ts";

type User = {
    id: number;
    email: string;
    password: string;
    name: string | null;
    isAdmin: boolean;
    createdAt: Date;
}



interface AuthenticatedRequest extends Request {
    user?: User;
  }

//protect routes
export const protect = asyncHandler(
    async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
      let token: string | undefined;
  
      token = req.cookies?.jwt;
  
      if (token) {
        try {
          // const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { userId: string };
          // const user = await User.findById(decoded.userId).select("-password");
  
          // if (!user) {
          //   res.status(401);
          //   throw new Error("User not found");
          // }
  
          // req.user = user;
          next();
        } catch (err) {
          res.status(401);
          throw new Error("Token Failed!");
        }
      } else {
        res.status(401);
        throw new Error("Unauthorized!");
      }
    }
  );

// Admin middleware 
export const admin = (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    if (req.user && req.user.isAdmin) {
      next();
    } else {
      res.status(401);
      throw new Error("Unauthorized as admin!");
    }
  };