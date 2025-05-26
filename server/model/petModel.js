// src/model/petModel.js
import mongoose from "mongoose";

const petSchema = new mongoose.Schema(
  {
    petName: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    photo: {
      type: String,
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// ✅ Log when saving pet
petSchema.pre("save", function (next) {
  console.log("📌 Saving Pet Record:", this);
  next();
});

export default mongoose.model("Pet", petSchema);
