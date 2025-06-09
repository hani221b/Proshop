import jwt from 'jsonwebtoken';
import express, { Request, Response } from "express";

const generateToken = (res: Response, userId: number) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET as string, {
    expiresIn: '30d',
  });

  // Set JWT as an HTTP-Only cookie
  res.cookie('jwt', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== 'dev', // Use secure cookies in production
    sameSite: 'strict', // Prevent CSRF attacks
    path: '/',
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    domain: process.env.NODE_ENV === 'dev' ? 'localhost' : undefined, // Set domain for development
  });
};

export default generateToken;