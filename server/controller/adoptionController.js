import AdoptionRequest from "../model/AdoptionRequest.js";

// Create a new adoption request
export const createAdoptionRequest = async (req, res) => {
  try {
    const newRequest = await AdoptionRequest.create({
      userId: req.user._id, // Get from verified JWT
      petName: req.body.petName,
      petType: req.body.petType,
      reason: req.body.reason,
    });

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

// Get a single user's adoption request
export const getUserAdoptionRequest = async (req, res) => {
  try {
    // Only allow the user themselves or an admin to access this
    if (req.user._id.toString() !== req.params.userId && req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied." });
    }

    const request = await AdoptionRequest.findOne({ userId: req.params.userId });

    if (!request) {
      return res.status(404).json({ message: "No adoption request found for this user." });
    }

    res.status(200).json(request);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
