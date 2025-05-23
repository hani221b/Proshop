import { Request, Response, NextFunction } from "express";
import jwt, { decode } from "jsonwebtoken";
import asyncHandler from "./asyncHanlder.ts";
import { PrismaClient, User, Prisma } from '@prisma/client';

const prisma = new PrismaClient();



interface AuthenticatedRequest extends Request {
    user?: SafeUser;
  }

type SafeUser = Prisma.UserGetPayload<{
  select: {
    id: true;
    name: true;
    email: true;
    isAdmin: true;
  };
}>;

//protect routes
export const protect = asyncHandler(
    async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
      let token: string | undefined;
  
      token = req.cookies?.jwt;
  
      if (token) {
        try {
          const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { userId: number };
          const user: SafeUser | null = await prisma.user.findUnique({where: {id: decoded.userId},
            select: {
              id: true,
              name: true,
              email: true,
              password: false,
              isAdmin: true,
              createdAt: false
            }});
  
          if (!user) {
            res.status(401);
            throw new Error("User not found");
          }
          
          (req as AuthenticatedRequest).user = user;  
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