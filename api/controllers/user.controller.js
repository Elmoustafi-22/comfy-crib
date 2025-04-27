import User from '../models/user.model.js';
import {errorHandler} from '../utils/error.js';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config()

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

export const uploadAvatar = async (req, res, next) => {
  const { id } = req.params;
  const { avatarUrl } = req.body;

  try {
    if (!avatarUrl || typeof avatarUrl !== 'string'){
      return next(errorHandler(400, 'Invalid avatar URL'))
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { $set: { avatar: avatarUrl } },
      { new: true }
    )

    if (!updatedUser) {
      return next(errorHandler(404, 'User not found'))
    }

    const { password, ...rest } = updatedUser._doc

    res.status(200).json(rest)
  } catch (error){
    next(error)
  }
}