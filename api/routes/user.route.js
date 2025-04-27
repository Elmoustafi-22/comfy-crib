import express from "express";
import { uploadAvatar } from "../controllers/user.controller.js";

const router = express.Router()

 router.put("/upload-avatar/:id", uploadAvatar);


 export default router