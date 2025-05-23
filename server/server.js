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

// ✅ Import Routes
import employeeRoutes from "./routes/employeeroutes.js";
import productRoutes from "./routes/productsRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";
import settingsRoutes from "./routes/settingsRoutes.js";
import adoptionRoutes from "./routes/adoptionRoutes.js"
// ✅ Convert __dirname for ES Module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Load Environment Variables
dotenv.config();

// ✅ Extract Environment Variables
const {
  PORT = 8000,
  MONGO_URL,
  JWT_SECRET,
  SESSION_SECRET,
  CORS_ORIGIN,
  NODE_ENV = "development",
} = process.env;

// ✅ Validate Required Environment Variables
if (!MONGO_URL || !JWT_SECRET || !SESSION_SECRET || !CORS_ORIGIN) {
  console.error("❌ Missing critical environment variables in .env");
  process.exit(1);
}

// ✅ Define Production Mode
const isProduction = NODE_ENV === "production";

// ✅ Setup Express App
const app = express();
const upload = multer({ dest: "uploads/" });

// ✅ Setup MongoDB Session Store
const MongoDBStore = connectMongoDBSession(session);
const store = new MongoDBStore({
  uri: MONGO_URL,
  collection: "sessions",
});

store.on("error", (error) => {
  console.error("❌ Session store error:", error);
});

// ✅ Allowed Origins for CORS
const allowedOrigins = [CORS_ORIGIN, "http://localhost:3000"];

// 🔒 Security Middleware
app.use(helmet()); // Secure headers
app.use(morgan(isProduction ? "tiny" : "dev")); // Log requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// 🔗 CORS Configuration
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("❌ CORS Policy Violation: Request Blocked"));
      }
    },
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
  })
);

// 🛠️ Session Configuration
// 🔗 CORS Configuration (Allow Multiple Origins)
app.use(
  cors({
    origin: function (origin, callback) {
      const allowedOrigins = [
        "https://hedj.netlify.app", // ✅ Deployed frontend
        "http://localhost:3000", // ✅ Local frontend for development
      ];

      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true); // ✅ Allow request
      } else {
        callback(new Error("CORS Policy Violation: Not Allowed"));
      }
    },
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true, // ✅ Allows cookies (important for authentication)
  })
);

// 🔑 JWT Token Creation Helper
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

// 🚀 Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URL);
    console.log("✅ Connected to MongoDB");

    // 🌍 Start Server After DB Connection
    app.listen(PORT, () =>
      console.log(
        `🚀 Server running on ${
          isProduction ? "Render" : "localhost"
        } at port ${PORT}`
      )
    );
  } catch (error) {
    console.error("❌ Database connection error:", error);
    process.exit(1);
  }
};

// ✅ Call function to connect to DB
connectDB();

// 📌 API Routes (Versioned)
app.use("/api/employees", employeeRoutes);
app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/settings", adoptionRoutes);

;
// 📂 Serve Static Files (Uploads)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ✅ Health Check Route
app.get("/", (req, res) => {
  res.json({
    message: `Hedj API is running on ${
      isProduction ? "Render" : "localhost"
    } 🚀`,
  });
});

// 🛠️ Error Handling Middleware
app.use((err, req, res, next) => {
  console.error("⚠️ Error:", err.message);
  res
    .status(500)
    .json({ message: "Internal Server Error", error: err.message });
});
