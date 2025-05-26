import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    password: {
      type: String,
      required: true,
    },

    firstName: {
      type: String,
      required: true,
    },

    middleName: {
      type: String,
    },

    lastName: {
      type: String,
      required: true,
    },

    gender: {
      type: String,
      enum: ["male", "female", "other"],
      required: true,
    },

    role: {
      type: String,
      enum: ["user", "employee", "admin"],
      default: "user",
    },

    department: {
      type: String,
      required: function () {
        return this.role === "employee";
      },
    },

    profilePhoto: {
      type: String, // URL or filename
    },

    receiveNotifications: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", UserSchema);

export default User;
