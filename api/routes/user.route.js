import express from "express";
import {
  uploadAvatar,
  updateUser,
  deleteUser,
  getUserListings
} from "../controllers/user.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router()

 router.put("/upload-avatar/:id", verifyToken, uploadAvatar);
 router.put('/update/:id', verifyToken, updateUser);
 router.delete("/delete/:id", verifyToken, deleteUser);
 router.get('/listing/:id', verifyToken, getUserListings)

 export default router