import express from "express";
import {
  login,
  logout,
  newUser,
  updateInfo,
  userInfo,
} from "../controllers/user.js";
import { authentication } from "../middlewares/auth.js";
import { singleUpload } from "../middlewares/multer.js";

const app = express.Router();

app.post("/new", newUser);
app.post("/login", login);

app.use(authentication);

app.post("/logout", logout);
app.get("/", userInfo);
app.post("/update", singleUpload,updateInfo);

export default app;
