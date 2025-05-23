import User from "../models/user.model.js";
import bcryptjs from "bcrypt";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const signup = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = bcryptjs.hashSync(password, salt);
    const newUser = new User({ username, email, password: hashedPassword });

    await newUser.save();
    res.status(200).json({
      message: "user created successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `${error.message}`,
    });
  }
};

export const signin = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const validUser = await User.findOne({ email });
    if (!validUser) return next(errorHandler(404, "User not found"));
    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if (!validPassword) return next(errorHandler(401, "Wrong credentials"));
    const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    const { password: pass, ...rest } = validUser._doc;
    res
      .cookie("access_token", token, {
        httpOnly: true,
        maxAge: 60 * 60 * 1000,
      })
      .status(200)
      .json(rest);
  } catch (error) {
    next(error);
  }
};

export const google = async (req, res, next) => {
  const { name, email, photo } = req.body;
  try {
    const user = await User.findOne({ email });

    if (user) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
      const { password: pass, ...rest } = user._doc;
      res
        .cookie("access_token", token, {
            httpOnly: true,
             maxAge: 60 * 60 * 1000,
        })
        .status(200)
        .json(rest)
    } else {
        const generatePassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
        const hashedPassword = bcryptjs.hashSync(generatePassword, 10)
        const newUser = new User({
          username:
            name.split(" ").join("").toLowerCase() +
            Math.random().toString(36).slice(-4),
          email,
          password: hashedPassword,
          avatar: photo
        });
        await newUser.save()
        const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        const { password: pass, ...rest } = newUser._doc;
        res.cookie("access_token", token, {
          httpOnly: true,
          expires: new Date(Date.now() + 60 * 60 * 1000),
        })
        .status(200)
        .json(rest)
    }
  } catch (error) {
    next(error);
  }
};

export const signout = async(req, res, next) => {
  try {
    res.clearCookie("access_token", {
      httpOnly: true,
      sameSite: "strict",
    });
    res.status(200).json({success: true, message: "Successfully signed out"});
  } catch(error) {
    next(error)
  }
}