import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";
import { createClient } from "@supabase/supabase-js";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
dotenv.config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

export const uploadAvatar = async (req, res, next) => {
  const { id } = req.params;
  if (String(req.user.id) !== String(id)){
    return next(errorHandler(401, "You can only update your own account"));
  }
  const { avatarUrl } = req.body;

  try {
    if (!avatarUrl || typeof avatarUrl !== "string") {
      return next(errorHandler(400, "Invalid avatar URL"));
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { $set: { avatar: avatarUrl } },
      { new: true }
    );

    if (!updatedUser) {
      return next(errorHandler(404, "User not found"));
    }

    const { password, ...rest } = updatedUser._doc;

    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (req, res, next) => {
  if (req.user.id !== req.params.id)
    return next(errorHandler(401, "You can only update your own account"));

  try {
    if (req.body.password) {
      req.body.password = bcrypt.hashSync(req.body.password, 10);
    }
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          username: req.body.username,
          email: req.body.email,
          password: req.body.password,
          avatar: req.body.avatar,
        },
      },
      {
        new: true,
      }
    );

    const { password, ...rest } = updatedUser._doc;

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      user: rest,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  if (req.user.id !== req.params.id) return next(errorHandler(401, 'You can only delete your own account!'));

  try {
    await User.findByIdAndDelete(req.params.id)
    res.status(200).json('User has been deleted!').clearCookie('access_token');
  } catch (error) {
    next(error)
  }
    
}