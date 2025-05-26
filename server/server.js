import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import session from "express-session";
import connectMongoDBSession from "connect-mongodb-session";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";
import multer from "multer";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";

// ✅ Routes
import employeeRoutes from "./routes/employeeroutes.js";
import petRoutes from "./routes/petRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";
import settingsRoutes from "./routes/settingsRoutes.js";
import adoptionRoutes from "./routes/adoptionRoutes.js";

// ✅ Convert __dirname for ES Module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Load Environment Variables
dotenv.config();

const {
  PORT = 8000,
  MONGO_URL,
  JWT_SECRET,
  SESSION_SECRET,
  CORS_ORIGIN,
  NODE_ENV = "development",
} = process.env;

if (!MONGO_URL || !JWT_SECRET || !SESSION_SECRET || !CORS_ORIGIN) {
  console.error("❌ Missing critical environment variables in .env");
  process.exit(1);
}

const isProduction = NODE_ENV === "production";
const app = express();
const upload = multer({ dest: "uploads/" });

// ✅ MongoDB Session Store
const MongoDBStore = connectMongoDBSession(session);
const store = new MongoDBStore({
  uri: MONGO_URL,
  collection: "sessions",
});

store.on("error", (error) => {
  console.error("❌ Session store error:", error);
});

// ✅ Middleware
app.use(helmet());
app.use(morgan(isProduction ? "tiny" : "dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ✅ CORS Setup (Fixed)
const allowedOrigins = [
  CORS_ORIGIN, // from .env → https://petadoptionagency.netlify.app
  "http://localhost:3000",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("❌ CORS Policy Violation: Not Allowed"));
      }
    },
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true, // ✅ allow cookies across origin
  })
);

// ✅ Optional: Add manual fallback headers
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", req.headers.origin || "*");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

// ✅ JWT Token Helper
const createToken = (_id, res) => {
  const token = jwt.sign({ _id }, JWT_SECRET, { expiresIn: "3d" });
  res.cookie("token", token, {
    httpOnly: true,
    secure: isProduction,
    sameSite: "strict",
    maxAge: 1000 * 60 * 60 * 24 * 7,
  });
  return token;
};

// ✅ Connect MongoDB and Start Server
const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URL);
    console.log("✅ Connected to MongoDB");

    app.listen(PORT, () =>
      console.log(
        `🚀 Server running on ${isProduction ? "Render" : "localhost"}:${PORT}`
      )
    );
  } catch (error) {
    console.error("❌ DB connection error:", error);
    process.exit(1);
  }
};

connectDB();

// ✅ API Routes
app.use("/api/employees", employeeRoutes);
app.use("/api/pets", petRoutes);
app.use("/api/users", userRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/adoption", adoptionRoutes);

// ✅ Serve Uploaded Files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ✅ Root Health Check
app.get("/", (req, res) => {
  res.json({
    message: `API running on ${isProduction ? "Render" : "localhost"} 🚀`,
  });
});

// ✅ Global Error Handler
app.use((err, req, res, next) => {
  console.error("❌ Error:", err.message);
  res.status(500).json({ message: "Server Error", error: err.message });
});
