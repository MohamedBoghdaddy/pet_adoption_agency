import mongoose from "mongoose";

const AdoptionRequestSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    petName: String,
    petType: String,
    reason: String,
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export default mongoose.model("AdoptionRequest", AdoptionRequestSchema);
