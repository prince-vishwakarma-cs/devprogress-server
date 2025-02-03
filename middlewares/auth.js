import { ErrorHandler } from "../utils/errorhandler.js";
import jwt from "jsonwebtoken";
import { TryCatch } from "./error.js";

export const authentication = TryCatch(async (req, res, next) => {
  const { token } = req.cookies;

  // Check if token is present
  if (!token) {
    throw new ErrorHandler("Unauthorized. No token provided.", 403);
  }

  try {
    // Verify the token and decode it
    const decoded = jwt.verify(token, process.env.SECRET_KEY_TOKEN);

    // Attach the decoded user information to the request object
    req.user = decoded;
    next();
  } catch (err) {
    // If token verification fails, handle the error
    if (err.name === "TokenExpiredError") {
      throw new ErrorHandler("Token expired. Please log in again.", 401);
    } else {
      throw new ErrorHandler("Invalid token. Please log in again.", 403);
    }
  }
});
