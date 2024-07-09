import jwt, { decode } from "jsonwebtoken";
import asyncHandler from "./asyncHanlder.js";
import User from "../models/UserModel.js";

//protect routes
export const protect = asyncHandler(async (req, res, next) => {
    let token;

     //read jwt from cookie
    token = req.cookies.jwt;
    if(token){
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.userId).select("-password"); 
            next();
        } catch (err) {
            res.status(401);
            throw new Error("Token Failed!");
        }
    } else {
        res.status(401);
        throw new Error("Unauthorized!");
    }
});

// Admin middleware 
export const admin = (req, res, next) => {
    if(req.user && req.user.iSAdmin){
        next();
    } else {
        res.status(401);
        throw new Error("Unauthorized as admin!");
    }
}