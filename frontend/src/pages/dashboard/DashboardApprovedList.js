import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/AdoptionPanel.css"; // Optional: add styles if needed

export default function AdminAdoptionPanel() {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await axios.get("http://localhost:4000/api/adoption/all");
        setRequests(res.data);
      } catch (error) {
        console.error("Error fetching adoption requests:", error);
      }
    };
    fetchRequests();
  }, []);

  const handleApprove = async (id, status) => {
    try {
      await axios.patch(`http://localhost:4000/api/adoption/update/${id}`, {
        status,
      });
      setRequests((prev) =>
        prev.map((req) => (req._id === id ? { ...req, status } : req))
      );
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const pendingRequests = requests.filter((req) => req.status === "pending");
  const approvedRequests = requests.filter((req) => req.status === "approved");

  return (
    <div className="admin-panel-container">
      <h2 className="panel-heading">🐾 Adoption Approval Panel</h2>

      {/* Pending Requests */}
      <div className="pending-section">
        <h3>Pending Requests</h3>
        {pendingRequests.length > 0 ? (
          pendingRequests.map((req) => (
            <div key={req._id} className="request-card">
              <p>
                <strong>{req.petName}</strong> ({req.petType}) — by{" "}
                {req.userId?.email}
              </p>
              <div className="action-buttons">
                <button
                  onClick={() => handleApprove(req._id, "approved")}
                  className="approve-btn"
                >
                  Approve
                </button>
                <button
                  onClick={() => handleApprove(req._id, "rejected")}
                  className="reject-btn"
                >
                  Reject
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>No pending requests.</p>
        )}
      </div>

      {/* Approved Requests */}
      <div className="approved-section">
        <h3>✅ Approved Requests</h3>
        {approvedRequests.length > 0 ? (
          approvedRequests.map((req) => (
            <div key={req._id} className="approved-card">
              <strong>{req.petName}</strong> ({req.petType}) — by{" "}
              {req.userId?.email}
            </div>
          ))
        ) : (
          <p>No approved requests yet.</p>
        )}
      </div>
    </div>
  );
}
