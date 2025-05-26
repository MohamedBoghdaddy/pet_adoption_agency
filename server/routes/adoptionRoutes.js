import express from "express";
import Report from "../model/Report.js"; // Make sure to use .js extension for ES modules
import {
  createAdoptionRequest,
  getAllAdoptionRequests,
  updateAdoptionStatus,
  getApprovedRequests,
  getUserAdoptionRequest,
} from "../controller/adoptionController.js";
import { generatePDF } from "../utils/pdfGenerator.js"; // Import your PDF generator
import { isAuthenticated, verifyAdmin } from "../middleware/AuthMiddleware.js";

const router = express.Router();

// Adoption Request Routes
router.post("/requests/create", isAuthenticated, createAdoptionRequest);
router.get(
  "/requests/all",
  isAuthenticated,
  verifyAdmin,
  getAllAdoptionRequests
);
router.patch(
  "/requests/update/:id",
  isAuthenticated,
  verifyAdmin,
  updateAdoptionStatus
);
router.get("/requests/approved", getApprovedRequests);
router.get("/requests/user/:userId", isAuthenticated, getUserAdoptionRequest);

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
