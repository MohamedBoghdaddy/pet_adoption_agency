// src/controller/petController.js
import asyncHandler from "express-async-handler";
import Pet from "../model/petModel.js";
import multer from "multer";
import path from "path";

// ✅ Multer Storage Configuration
const storage = multer.diskStorage({
  destination: "./uploads/", // ✅ Ensure this folder exists
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

// ✅ Multer Upload Middleware
export const upload = multer({ storage });

// ✅ Upload Pet Image
export const uploadPetImage = asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No image uploaded." });
  }
  res.json({ imageUrl: `/uploads/${req.file.filename}` });
});

// ✅ Create New Pet
export const createPet = asyncHandler(async (req, res) => {
  const { petName, description } = req.body;
  const photo = req.file ? `/uploads/${req.file.filename}` : null;

  if (!petName || !description || !photo) {
    return res.status(400).json({ message: "All fields are required." });
  }

  const newPet = new Pet({
    petName,
    description,
    photo,
    createdBy: req.user._id,
  });

  await newPet.save();
  res.status(201).json({ message: "Pet added successfully", pet: newPet });
});

// ✅ Get All Pets
export const getPets = asyncHandler(async (req, res) => {
  const pets = await Pet.find().sort({ createdAt: -1 });
  res.status(200).json({ count: pets.length, pets });
});

// ✅ Get Pet by ID
export const getPetById = asyncHandler(async (req, res) => {
  const pet = await Pet.findById(req.params.id);
  if (!pet) return res.status(404).json({ message: "Pet not found" });
  res.status(200).json(pet);
});

// ✅ Update Pet
export const updatePet = asyncHandler(async (req, res) => {
  const { petName, description } = req.body;
  const updatedPet = await Pet.findByIdAndUpdate(
    req.params.id,
    { petName, description },
    { new: true }
  );
  if (!updatedPet) return res.status(404).json({ message: "Pet not found" });

  res
    .status(200)
    .json({ message: "Pet updated successfully", pet: updatedPet });
});

// ✅ Delete Pet
export const deletePet = asyncHandler(async (req, res) => {
  const deletedPet = await Pet.findByIdAndDelete(req.params.id);
  if (!deletedPet) return res.status(404).json({ message: "Pet not found" });

  res.status(200).json({ message: "Pet deleted successfully" });
});

// ✅ Dummy Middleware (Optional Validation)
export const validatePet = (req, res, next) => {
  if (!req.body.petName || !req.body.description) {
    return res.status(400).json({ message: "Missing required fields" });
  }
  next();
};
