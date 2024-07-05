import express from "express";
import {
    authUser,
    registerUser,
    logoutUser,
    getUserProfile,
    updateUserProfile,
    getUsers,
    deleteUsers,
    getUsersById,
    updateUser
} from "../controllers/userController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/").post(registerUser).get(protect, admin, getUsers);
router.route("/logout").post(logoutUser);
router.route("/login").post(authUser);
router.route("/profile").get(protect, getUserProfile).put(protect, updateUserProfile);
router.route("/:id").get(protect, admin,getUsersById).put(protect, admin,updateUser).delete(protect, admin, deleteUsers);


export default router;