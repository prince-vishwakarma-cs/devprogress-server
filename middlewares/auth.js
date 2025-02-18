import { ErrorHandler } from "../utils/errorhandler.js";
import jwt from "jsonwebtoken";
import { TryCatch } from "./error.js";

export const authentication = TryCatch(async (req, res, next) => {
  const { token } = req.cookies;
  if (!token) {
    throw new ErrorHandler("Unauthorized. No token provided", 403);
  }
  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY_TOKEN);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ success: false, message: "Invalid token" });
  }
});
