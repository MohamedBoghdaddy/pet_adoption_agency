import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    gender: { type: String, required: true },
    firstName: { type: String, required: true },
    middleName: { type: String },
    lastName: { type: String, required: true },
    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
    cart: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],

    role: {
      type: String,
      enum: ["customer", "employee", "admin"],
      default: "customer", // Default to customer if not specified
    },

    department: {
      type: String,
      required: function () {
        return this.role === "employee"; // Department is required for employees
      },
    },

    receiveNotifications: {
      type: Boolean,
      default: true,
    },

    profilePhoto: {
      type: String,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", UserSchema);

export default User;