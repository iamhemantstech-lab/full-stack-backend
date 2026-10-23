import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(
  cors({
    origin: process.env.CROSS_ORIGIN,
    credentials: true,
  })
);

app.use(express.json({ limit: "20kb" }));
app.use(express.urlencoded({ extended: true, limit: "20kb" }));
app.use(express.static("public"));
// set cookie from server on the frontend site
app.use(cookieParser());

// routes import
import userRouter from "./routes/user.Routes.js";

// routes declartion
// here we used middleware for call routes and controll goes to import route
app.use("/api/v1/users", userRouter);

export { app };
