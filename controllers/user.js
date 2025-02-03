import { Error } from "mongoose";
import { TryCatch } from "../middlewares/error.js";
import { User } from "../models/user.js";
import { ErrorHandler } from "../utils/errorhandler.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { deleteFromCloudinary, uploadToCloudinary } from "../utils/features.js";

export const newUser = TryCatch(async (req, res) => {
  const { _id, name, password } = req.body;

  if (!_id || !name || !password)
    throw new ErrorHandler("Enter all the fields", 400);

  const exists = await User.findById(_id);

  if (exists) throw new ErrorHandler("User already exists", 400);

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    _id,
    password: hashedPassword,
    name,
  });

  const token = jwt.sign({ _id: user._id }, process.env.SECRET_KEY_TOKEN);

  res.cookie("token", token, {
    httpOnly: true,
    expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
  });

  res.status(201).json({
    success: true,
    message: "User Created Successfully",
  });
});

export const login = TryCatch(async (req, res) => {
  const { _id, password } = req.body;

  if (!_id || !password)
    throw new ErrorHandler("Please Enter all the fields", 400);

  const user = await User.findById(_id).select("+password");

  if (!user) throw new ErrorHandler("UserId or password is wrong", 400);

  const isSame = await bcrypt.compare(password, user.password);

  if (!isSame) throw new ErrorHandler("UserId or password is wrong", 400);

  const token = jwt.sign({ _id: user._id }, process.env.SECRET_KEY_TOKEN);

  res.cookie("token", token, {
    httpOnly: true,
    expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
  });

  res.status(201).json({
    success: true,
    user: {
      _id: user._id,
      name: user.name,
    },
  });
});

export const logout = TryCatch(async (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: "Successfully logged out",
  });
});

export const userInfo = TryCatch(async (req, res) => {
  const { _id } = req.user;

  if (!_id) throw new ErrorHandler("Please login First", 401);

  const user = await User.findById(_id);

  if (!user) throw new ErrorHandler("User not found", 404);

  res.status(200).json({
    success: true,
    user,
  });
});

export const updateInfo = TryCatch(async (req, res) => {
  const { name, leetcode, gfg, codechef, codeforces } = req.body;

  const userId = req.user._id;

  if (!userId) throw new ErrorHandler("Please login First", 401);

  const user = await User.findById(userId);

  if (!user) throw new ErrorHandler("User not found", 404);

  const avatar = req.file;

  if (name) {
    user.name = name;
  }

  if (avatar) {
    const previousphoto = user.avatar?.public_id;

    const { public_id, url } = await uploadToCloudinary(
      avatar,
      process.env.CLOUDINARY_FOLDER
    );

    user.avatar = { public_id, url };

    if (previousphoto) await deleteFromCloudinary(previousphoto);
  }
  if (leetcode) {
    user.platform_url.leetcode = leetcode;
  }
  if (gfg) {
    user.platform_url.gfg = gfg;
  }
  if (codeforces) {
    user.platform_url.codeforces = codeforces;
  }
  if (codechef) {
    user.platform_url.codechef = codechef;
  }

  await user.save();

  res.status(200).json({
    success: true,
    message: "User information updated successfully",
    user,
  });
});
