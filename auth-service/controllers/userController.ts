import asyncHandler from "../middleware/asyncHanlder";
// import User from "../models/UserModel.ts";
import jwt from "jsonwebtoken";
import { Request, Response } from 'express';
import generateToken from "../utils/generateToken";
import { PrismaClient, User } from '@prisma/client';
import bcrypt from "bcryptjs";


async function matchPassword(enteredPassword: string, userPassword: string): Promise<boolean> {
  return await bcrypt.compare(enteredPassword, userPassword);
};


const prisma = new PrismaClient();

interface IGetUserAuthInfoRequest extends Request {
  user?: User // or any other type
}

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  PublicIGetUserAuthInfoRequest
const authUser = asyncHandler(async (req: IGetUserAuthInfoRequest, res: Response) => {
    const {email, password} = req.body;
    const user = await prisma.user.findUnique({ where: {email} });
    if(user && (await matchPassword(password, user.password))){
        generateToken(res, user.id);
        res.json({
            id: user.id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin
        })
    } else {
        res.status(401);
        throw new Error("Invalid email or password");
    }
});

// @desc    Register user
// @route   POST /api/users/login
// @access  Public
const registerUser = asyncHandler(async (req: IGetUserAuthInfoRequest, res: Response) => {
    const { name, email, password } = req.body;
    const userExists = await prisma.user.findUnique({ where: {email} });
    const hasedPassword = await bcrypt.hash(password, 10 as any);
    if(userExists){
        res.status(400);
        throw new Error("User already exists")
    }
    const user = await prisma.user.create({
        data: {
            name, email,
            password: hasedPassword
        }
    });
    if(user){
        generateToken(res, user.id);
        res.status(201).json({
            id: user.id,
            name: user.name,
            email: user.email,
            iSAdmin: user.isAdmin
        });
    } else {
        res.status(400);
        throw new Error("Invalid user data");
    }
 });

// @desc    logout user & clear cookie
// @route   POST /api/users/logout
// @access  Privateimport '@types/express';

const logoutUser = asyncHandler(async (req, res) => {
    res.cookie("jwt", "", {
        httpOnly: true,
        expires: new Date(0)
    });

    res.status(200).json({message: "Logged out successfully!"})
});

// @desc    Get user profile
// @route   Get /api/users/profile
// @access  Private
const getUserProfile = asyncHandler(async (req: IGetUserAuthInfoRequest, res: Response) => {
    const user = await prisma.user.findUnique({
        where: {
            id: req.user!.id
        }
    });
    if(user) {
        res.status(200).json({
            id: user.id,
            name: user.name,
            email: user.name,
            iSAdmin: user.isAdmin
        });
    } else {
        res.status(404);
        throw new Error("User not found");
    }
});

// @desc    Update user profile
// @route   Get /api/users/profile
// @access  Private
const updateUserProfile = asyncHandler(async (req: IGetUserAuthInfoRequest, res: Response) => {
      const user = await prisma.user.findUnique({
            where: {
                id: req.user!.id
            }
      });  
      if(user) {
    //     user.name = req.body.name || user.name;
    //     user.email = req.body.email || user.email;
    //     if(req.body.password){
    //         user.password = req.body.password
    //     }
    //     const updatedUser = await user.save();
        const updatedUser = await prisma.user.update({
            where: {
                id: req.user!.id
            },
            data: {
                name: req.body.name,
                email: req.body.eamil,
            }
        });
        res.status(200).json({
            id: updatedUser.id,
            name: updatedUser.name,
            email: updatedUser.name,
            iSAdmin: updatedUser.isAdmin
        })
    } else {
        res.status(404);
        throw new Error("User not found");
    }
});

// @desc    Get all users
// @route   Get /api/users
// @access  Private/Admin
const getUsers = asyncHandler(async (req, res) => {
    res.send("getUsers");
});

// @desc    Get user by id
// @route   Get /api/users/:id
// @access  Private/Admin
const getUsersById = asyncHandler(async (req, res) => {
    const idParam = req.params?.id;
    const id = parseInt(idParam);
        
    const user = await prisma.user.findUnique({where: {
        id: id
    }});
    if(user){
        res.status(200).json(user);
    } else {
        res.status(500);
        throw new Error("Could not fetch user!");
    }
});

// @desc    Delete users
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUsers = asyncHandler(async (req, res) => {
    res.send("deleteUsers");
});

// @desc    update user
// @route   PUT /api/users/:id
// @access  Private/Admin
const updateUser = asyncHandler(async (req, res) => {
    res.send("deleteUsers");
});

export {
    authUser,
    registerUser,
    logoutUser,
    getUserProfile,
    updateUserProfile,
    getUsers,
    deleteUsers,
    getUsersById,
    updateUser
}