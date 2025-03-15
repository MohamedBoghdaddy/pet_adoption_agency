import mongoose from "mongoose";

const validCategories = [
  "Kitchen",
  "Bedroom",
  "Day Complements",
  "Night Complements",
  "Outdoor",
];

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    stock: { type: Number, required: true, min: 0 }, // ✅ Stock is required
    category: {
      type: String,
      required: true,
      trim: true,
      enum: validCategories, // ✅ Ensure category is valid
    },
    images: {
      type: [String],
      required: true,
      validate: {
        validator: function (images) {
          return images.length > 0; // ✅ Ensure at least one image is provided
        },
        message: "At least one product image is required.",
      },
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "createdByModel",
      required: true,
    }, // ✅ Dynamic Reference (Admin or Employee)
    createdByModel: {
      type: String,
      required: true,
      enum: ["User", "Employee"], // ✅ Ensure only valid model names
    },
  },
  { timestamps: true }
);

// ✅ Pre-save Hook for Debugging
productSchema.pre("save", function (next) {
  console.log("📌 Saving Product:", this);
  next();
});

export default mongoose.model("Product", productSchema);
