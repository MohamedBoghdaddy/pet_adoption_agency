import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";
import jwt from "jsonwebtoken";

// ✅ Route Imports
import employeeRoutes from "./routes/employeeroutes.js";
import petRoutes from "./routes/petRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";
import settingsRoutes from "./routes/settingsRoutes.js";
import adoptionRoutes from "./routes/adoptionRoutes.js";

// ✅ Load Env Variables
dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Extract Config
const {
  PORT = 8000,
  MONGO_URL,
  JWT_SECRET,
  NODE_ENV = "development",
} = process.env;

const isProduction = NODE_ENV === "production";
const app = express();

// ✅ Basic Middleware
app.use(helmet());
app.use(morgan(isProduction ? "tiny" : "dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ✅ CORS: Accept Any Origin (Use only in development or if trusted frontend is handling auth)
app.use(
  cors({
    origin: true, // Reflects request origin
    credentials: true,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  })
);

// ✅ Handle Preflight (OPTIONS) Requests
app.options(
  "*",
  cors({
    origin: true,
    credentials: true,
  })
);

// ✅ Connect to MongoDB
mongoose
  .connect(MONGO_URL)
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(PORT, () => {
      console.log(
        `🚀 Server running on ${isProduction ? "Render" : "localhost"}:${PORT}`
      );
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  });

// ✅ API Routes
app.use("/api/employees", employeeRoutes);
app.use("/api/pets", petRoutes);
app.use("/api/users", userRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/adoption", adoptionRoutes);

// ✅ Serve Static Files (e.g., images)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ✅ Health Check
app.get("/", (req, res) => {
  res.json({ message: "🚀 Pet Adoption Agency API is running." });
});

// ✅ Global Error Handler
app.use((err, req, res, next) => {
  console.error("❌ Error:", err.message);
  res.status(500).json({ error: err.message });
});
