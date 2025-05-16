import express from "express";
import Report from "../models/Report.js"; // Make sure to use .js extension for ES modules
import {
  createAdoptionRequest,
  getAllAdoptionRequests,
  updateAdoptionStatus,
  getApprovedRequests,
} from "../controllers/adoptionController.js";
import { generatePDF } from "../utils/pdfGenerator.js"; // Import your PDF generator

const router = express.Router();

// Adoption Request Routes
router.post("/requests/create", createAdoptionRequest);
router.get("/requests/all", getAllAdoptionRequests);
router.patch("/requests/update/:id", updateAdoptionStatus);
router.get("/requests/approved", getApprovedRequests);

// Adoption Report Routes
router.get("/reports", async (req, res) => {
  try {
    const reports = await Report.find();
    res.json(reports);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/reports/generate", async (req, res) => {
  const report = new Report({
    title: req.body.title,
    type: req.body.type,
    data: req.body.data,
    generatedBy: req.user._id, // Assuming you have user auth
  });

  try {
    const newReport = await report.save();
    res.status(201).json(newReport);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.get("/reports/download/:id", async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);
    if (!report) return res.status(404).json({ message: "Report not found" });

    const pdfBuffer = generatePDF(report);

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=${report.title}.pdf`
    );
    res.send(pdfBuffer);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
