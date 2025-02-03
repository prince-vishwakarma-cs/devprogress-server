import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./utils/features.js";
import cookieParser from "cookie-parser";
import userRouter from "./routes/user.js";
import { errorMiddleware } from "./middlewares/error.js";
import cors from "cors";
import { gfg } from "./controllers/platforms.js";

dotenv.config({
  path: ".env",
});

const port = process.env.PORT;
const mongo_uri = process.env.MONGO_URI;

const app = express();
connectDB(mongo_uri);

const corsOptions = {
  origin: process.env.FRONTEND_URL,
  credentials: true,
};

app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOptions));

app.use("/api/v1/user", userRouter);

app.get("/gfg/:username",gfg)

app.get("/", (req, res) => {
  res.send("Server is working");
});

app.use(errorMiddleware);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
