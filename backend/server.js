import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import mongoSanitize from "express-mongo-sanitize";
import "dotenv/config";

import connectDB from "./config/mongodb.js";
import connectCloudinary from "./config/cloudinary.js";
import errorHandler from "./middleware/errorHandler.js";

import userRouter from "./routes/userRoute.js";
import listingRouter from "./routes/listingRoute.js";
import orderRouter from "./routes/orderRoute.js";

// App Config
const app = express();
const port = process.env.PORT || 4000;

// Connect to Databases
connectDB();
connectCloudinary();

// Middlewares
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(mongoSanitize()); // Prevent NoSQL Injection

// CORS configuration
const allowedOrigins = (process.env.FRONTEND_URLS || "http://localhost:5173,http://localhost:5174").split(",").map((o) => o.trim());
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error("Origin not allowed by CORS."));
  },
  credentials: true,
}));

// API Endpoints
app.use("/api/user", userRouter);
app.use("/api/listings", listingRouter);
app.use("/api/orders", orderRouter);

app.get("/", (req, res) => {
  res.json({ success: true, message: "ScholarNest API is running" });
});

// Centralized error handler
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
