import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import asyncHandler from "./asyncHanlder";
import axios from "axios";

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
          
          const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { userId: string };
          await axios.get(`${process.env.AUTH_SERVICE_URL}/${decoded.userId}`, {
            headers: { 
              Cookie: `jwt=${token}`
            }
          }).then(response => {
              if (response.status === 200) {
                (req as AuthenticatedRequest).user = response.data;  
                next();
              } else {
                return res.status(500).json({ error: 'Auth service error' }); // Added .json() and return
              }

          }).catch(err => {
              console.error('Auth middleware error:', err);
              
              if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
                return res.status(401).json({ error: 'Invalid or expired token' });
              }
              
              if (err.response?.status === 404) {
                return res.status(401).json({ error: 'User not found' });
              }
              
              return res.status(401).json({ error: err });
          }); 
              
        } catch (err) {
          
          console.log(err);
          
          res.status(500);
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