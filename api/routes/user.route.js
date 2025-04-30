import express from "express";
import {
  uploadAvatar,
  updateUser,
  deleteUser,
} from "../controllers/user.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router()

 router.put("/upload-avatar/:id", verifyToken, uploadAvatar);
 router.put('/update/:id', verifyToken, updateUser);
 router.delete("/delete/:id", verifyToken, deleteUser);


 export default router