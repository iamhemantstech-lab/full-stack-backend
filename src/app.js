import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { ApiResponse } from "./utils/ApiResponse.js";

const app = express();

// Trust reverse proxy (needed for Render, Heroku, AWS, Nginx to handle HTTPS & secure cookies properly)
app.set("trust proxy", 1);

const allowedOrigins = process.env.CROSS_ORIGIN
  ? process.env.CROSS_ORIGIN.split(",").map((origin) => origin.trim().replace(/\/+$/, ""))
  : ["http://localhost:5173"];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. mobile apps, curl, Postman)
      if (!origin) return callback(null, true);

      // If wildcard is configured, reflect the origin so credentials mode works
      if (allowedOrigins.includes("*")) {
        return callback(null, true);
      }

      const isLocalhost =
        /^http:\/\/localhost(:\d+)?$/.test(origin) ||
        /^http:\/\/127\.0\.0\.1(:\d+)?$/.test(origin);

      if (
        allowedOrigins.includes(origin) ||
        (process.env.NODE_ENV !== "production" && isLocalhost)
      ) {
        return callback(null, true);
      }

      return callback(null, false);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept"],
  })
);

app.use(express.json({ limit: "20kb" }));
app.use(express.urlencoded({ extended: true, limit: "20kb" }));
app.use(express.static("public"));
// set cookie from server on the frontend site
app.use(cookieParser());

// check on production
app.get("/", (_, res) => {
  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        null,
        "Backend is running successfully on production!"
      )
    );
});

// routes import
import userRouter from "./routes/user.Routes.js";

// routes declartion
// here we used middleware for call routes and controll goes to import route
app.use("/api/v1/users", userRouter);

// Global Error Handler Middleware
// Express requires all 4 parameters (err, req, res, next) to recognize it as an error handler
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Something went wrong";

  return res.status(statusCode).json({
    statusCode,
    success: false,
    message,
    errors: err.errors || [],
    ...(process.env.NODE_ENV !== "production" ? { stack: err.stack } : {}),
  });
});

export { app };
