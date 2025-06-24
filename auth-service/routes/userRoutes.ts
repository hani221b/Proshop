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
} from "../controllers/userController";
import { protect, admin } from "../middleware/authMiddleware";

const router = express.Router();

router.route("/").post(registerUser).get(protect, getUsers);
router.route("/logout").post(logoutUser);
router.route("/login").post(authUser);
router.route("/profile").get(protect, getUserProfile).put(protect, updateUserProfile);
router.route("/:id").get(protect ,getUsersById).put(protect,updateUser).delete(protect, deleteUsers);


export default router;