import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import multer from "multer";
import path from "path";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname } from "path";
import User from "../model/usermodel.js";
import asyncHandler from "express-async-handler";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const JWT_SECRET = process.env.JWT_SECRET;

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../uploads"));
  },
  filename: (req, file, cb) => {
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    );
  },
});
export const upload = multer({ storage: storage });

// Function to create a JWT token
const createToken = (user) =>
  jwt.sign({ id: user._id, role: user.role, email: user.email }, JWT_SECRET, {
    expiresIn: "30d",
  });

// Register a new user
export const registerUser = async (req, res) => {
  const { username, email, password, firstName, lastName, gender } = req.body;

  if (!username || !email || !password || !firstName || !lastName || !gender) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "Email already in use" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      username,
      email,
      password: hashedPassword,
      firstName,
      lastName,
      gender,
    });
    await user.save();

    const token = createToken(user);
    res.status(201).json({ token, 
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        gender: user.gender,
        firstName: user.firstName,
        middleName: user.middleName,
        lastName: user.lastName,
      },
     });
  } catch (error) {
    console.error("Registration failed:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Login user
export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ message: "Email and password required" });

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials" });

    const token = createToken(user);
    res
      .status(200)
      .json({
        token,
        user: { _id: user._id, username: user.username, email: user.email, role: user.role },
      });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

// Logout user
export const logoutUser = async (req, res) => {
  try {
    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ message: "Logout failed" });
  }
};

// Get all users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get single user
export const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Update user profile with optional profile photo
export const updateUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const updates = { ...req.body };

    if (req.file) {
      updates.profilePhoto = `/uploads/${req.file.filename}`;
    }
    const updatedUser = await User.findByIdAndUpdate(userId, updates, {
      new: true,
    }).select("-password");
    if (!updatedUser)
      return res.status(404).json({ message: "User not found" });

    res
      .status(200)
      .json({ message: "User updated successfully", user: updatedUser });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Server error" });
  }
};



// Delete user
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.userId);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Search users by username
export const searchUsers = async (req, res) => {
  try {
    const { username } = req.query;
    if (!username)
      return res.status(400).json({ message: "Username required" });

    const users = await User.find({
      username: { $regex: username, $options: "i" },
    }).select("-password");
    if (!users.length)
      return res.status(404).json({ message: "No users found" });
    res.status(200).json(users);
  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({ message: "Server error" });
  }
};


export const checkAuth = async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ message: "Not authenticated" });

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// ✅ Get Users Based on Role
export const getUsersByRole = asyncHandler(async (req, res) => {
  try {
    const { role } = req.query;

    // ✅ Ensure role is provided and is a string
    if (!role || typeof role !== "string") {
      return res
        .status(400)
        .json({ message: "Valid role query parameter is required" });
    }

    // ✅ Allow only "admin" and "customer"
    const validRoles = ["admin", "customer"];
    const roleLower = role.toLowerCase();

    if (!validRoles.includes(roleLower)) {
      return res.status(400).json({
        message: `Invalid role specified. Allowed roles: ${validRoles.join(", ")}`,
      });
    }

    // ✅ Fetch users based on role (case-insensitive)
    const users = await User.find({ role: new RegExp(`^${roleLower}$`, "i") });

    if (users.length === 0) {
      return res.status(404).json({ message: `No ${roleLower}s found` });
    }

    res.status(200).json(users);
  } catch (error) {
    console.error("❌ Error fetching users by role:", error);
    res.status(500).json({ message: "Failed to fetch users" });
  }
});



export const createAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // ✅ Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // ✅ Hash password before saving
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // ✅ Create new admin user
    const newAdmin = new User({
      name,
      email,
      password: hashedPassword,
      role: "admin", // ✅ Set role to admin
    });

    await newAdmin.save();
    res.status(201).json({ message: "Admin created successfully" });
  } catch (error) {
    console.error("Error creating admin:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

