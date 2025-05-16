import AdoptionRequest from "../models/AdoptionRequest.js";

// Create a new adoption request
export const createAdoptionRequest = async (req, res) => {
  try {
    const newRequest = await AdoptionRequest.create(req.body);
    res.status(201).json(newRequest);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get all adoption requests (admin only)
export const getAllAdoptionRequests = async (req, res) => {
  try {
    const requests = await AdoptionRequest.find().populate("userId", "email");
    res.status(200).json(requests);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update adoption request status (approve/reject)
export const updateAdoptionStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const updated = await AdoptionRequest.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    res.status(200).json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get approved adoption requests
export const getApprovedRequests = async (req, res) => {
  try {
    const approvedRequests = await AdoptionRequest.find({ status: "approved" });
    res.status(200).json(approvedRequests);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
