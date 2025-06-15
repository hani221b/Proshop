import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import asyncHandler from "./asyncHanlder";
import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

type SafeUser = Prisma.UserGetPayload<{
  select: {
    id: true;
    name: true;
    email: true;
    isAdmin: true;
    createdAt: true;
  };
}>;

declare global {
  namespace Express {
    interface Request {
      user?: SafeUser;
    }
  }
}

//protect routes
export const protect = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies?.jwt;

    if (!token) {
      console.log("Unauthorized: no token");
       res.status(401).json({ message: "Unauthorized: no token" });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { userId: number };
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
        select: {
          id: true,
          name: true,
          email: true,
          isAdmin: true,
          createdAt: true,
        },
      });

      if (!user) {
         res.status(401).json({ message: "User not found" });
      }

      req.user = user as SafeUser;
      next();
    } catch (error) {
      console.error("Token verification failed:", error);
       res.status(401).json({ message: "Token failed or invalid" });
    }
  }
);


// Admin middleware 
export const admin = (
    req: Request,
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