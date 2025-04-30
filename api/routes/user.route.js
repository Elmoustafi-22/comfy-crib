import express from "express";
import { uploadAvatar, updateUser } from "../controllers/user.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router()

 router.put("/upload-avatar/:id", verifyToken, uploadAvatar);
 router.put('/update/:id', verifyToken, updateUser)


 export default router