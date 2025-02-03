import mongoose from "mongoose";
import cloudinary from "../middlewares/cloudinary.js";

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
