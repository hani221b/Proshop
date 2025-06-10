import jwt from 'jsonwebtoken';
import express, { Request, Response } from "express";

const generateToken = (res: Response, userId: number) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET as string, {
    expiresIn: '30d',
  });

  // Set JWT as an HTTP-Only cookie
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV !== 'dev',
    sameSite: 'lax' as const,
    path: '/',
    maxAge: 30 * 24 * 60 * 60 * 1000,
    domain: process.env.NODE_ENV === 'dev' ? undefined : undefined,
  };
  
  res.cookie('jwt', token, cookieOptions);
  
};

export default generateToken;