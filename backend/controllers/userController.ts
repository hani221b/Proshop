import asyncHandler from "../middleware/asyncHanlder.ts";
import User from "../models/UserModel.ts";
import jwt from "jsonwebtoken";
import generateToken from "../utils/generateToken.ts";
import { IUser } from "../models/UserModel"; 


declare global {
  namespace Express {
    interface Request {
      user?: IUser; 
    }
  }
}

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
const authUser = asyncHandler(async (req, res) => {
    const {email, password} = req.body;
    const user = await User.findOne({ email });
    if(user && (await user.matchPassword(password))){
        generateToken(res, user._id as string);
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.iSAdmin
        })
    } else {
        res.status(401);
        throw new Error("Invalid email or password");
    }
});

// @desc    Register user
// @route   POST /api/users/login
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;
    const userExists = await User.findOne({email});
    if(userExists){
        res.status(400);
        throw new Error("User already exists")
    }
    const user = await User.create({
        name, email, password
    });
    if(user){
        generateToken(res, user._id as string);
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.name,
            iSAdmin: user.iSAdmin
        });
    } else {
        res.status(400);
        throw new Error("Invalid user data");
    }
 });

// @desc    logout user & clear cookie
// @route   POST /api/users/logout
// @access  Private
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
const getUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user!._id);
    if(user) {
        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.name,
            iSAdmin: user.iSAdmin
        });
    } else {
        res.status(404);
        throw new Error("User not found");
    }
});

// @desc    Update user profile
// @route   Get /api/users/profile
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user!._id);
    if(user) {
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        if(req.body.password){
            user.password = req.body.password
        }
        const updatedUser = await user.save();
        res.status(200).json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.name,
            iSAdmin: updatedUser.iSAdmin
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
    res.send("getUsersById");
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