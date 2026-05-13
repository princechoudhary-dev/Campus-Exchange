import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import authRouter from "./api/router/auth.routes.js";
import cookieParser from "cookie-parser";
import collegeRoutes from "./api/router/college.routes.js";
import productRouter from "./api/router/product.routes.js";
dotenv.config();

const app = express();

// middleware
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://127.0.0.1:5173",
      "http://localhost:5174",
    ],
    credentials: true,
  }),
); //“Ruk bhai 😄
// Yeh request ek alag address (origin) pe ja rahi hai.
// Kya backend ne permission di hai?”

// Agar backend ne permission nahi di, to browser request block kar dega.

// Isi permission ke liye hota hai:

app.use(express.json()); // frontend say  command req.body and allow json values
app.use(cookieParser());

// routes
app.use("/api/auth", authRouter);
//.use() is used to connect middleware or routes to your app.  //authRouter is the router file that contains auth routes.
///api=“This is a backend API route”   // auth:“This route is for authentication”
app.use("/api/college", collegeRoutes);
app.use("/api/product", productRouter);
export default app;
