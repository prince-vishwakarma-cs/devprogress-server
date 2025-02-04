import mongoose from "mongoose";
import cloudinary from "../middlewares/cloudinary.js";
import jwt from "jsonwebtoken"

export const connectDB = (mongoURI) => {
  mongoose
    .connect(mongoURI)
    .then((data) => console.log(`DB connected : ${data.connection.host}`))
    .catch((error) => console.log("DB connection failed", error));
};

const getBase64 = (file) =>
  `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;

export const uploadToCloudinary = async (file, folder) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(
      getBase64(file),
      {
        folder: folder,
      },
      (error, result) => {
        if (error) return reject(error);
        resolve({
          public_id: result.public_id,
          url: result.secure_url,
        });
      }
    );
  });
};

export const deleteFromCloudinary = async (publicId) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.destroy(publicId, (error, result) => {
      if (error) return reject(error);
      resolve();
    });
  });
};

export const sendToken = (user, statusCode, res, message) => {
  const token = jwt.sign(
    {
      _id: user._id,
    },
    process.env.SECRET_KEY_TOKEN
  );
  const options = {
    expires: new Date(
      Date.now() + 7* 24 * 60 * 60 * 1000
    ),
    sameSite: "none",
    secure: true,
    httpOnly: true,
  };
  res.status(statusCode).cookie("token", token, options).json({
    success: true,
    user,
    message,
  });
};
