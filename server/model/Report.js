import mongoose from "mongoose";

const ReportSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    petId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Pet",
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
    },
    status: {
      type: String,
      enum: ["open", "in progress", "resolved"],
      default: "open",
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    resolvedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Report", ReportSchema);
