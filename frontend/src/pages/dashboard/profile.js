// src/pages/dashboard/Profile.js
import { useState, useEffect } from "react";
import { BsPersonCircle, BsPencilSquare } from "react-icons/bs";
import useDashboard from "../../hooks/useDashboard";
import { useAuthContext } from "../../context/AuthContext";
import { toast } from "react-toastify";
import { Container, Form, Button, Spinner } from "react-bootstrap";
import "../../styles/Profile.css";

const Profile = () => {
  const { state: dashboardState, fetchProfile } = useDashboard();
  const { state: authState } = useAuthContext();
  const { user } = authState;

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    gender: "",
  });

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  useEffect(() => {
    if (dashboardState.profile) {
      setFormData({
        firstName: dashboardState.profile.firstName || "",
        lastName: dashboardState.profile.lastName || "",
        email: dashboardState.profile.email || "",
        gender: dashboardState.profile.gender || "",
      });
    }
  }, [dashboardState.profile]);

  const handleEditToggle = () => setIsEditing((prev) => !prev);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      const updatedProfile = {
        ...formData,
      };

      const response = await fetch(
        `http://localhost:8000/api/users/${user._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          credentials: "include",
          body: JSON.stringify(updatedProfile),
        }
      );

      if (!response.ok) throw new Error("Failed to update profile");

      await fetchProfile();
      toast.success("Profile updated successfully.");
      setIsEditing(false);
    } catch (error) {
      toast.error("Error updating profile.");
      console.error("Error updating profile:", error);
    }
  };

  return (
    <Container className="profile-container">
      <h2 className="profile-title">My Profile</h2>
      {!dashboardState.profile ? (
        <div className="profile-loading">
          <Spinner animation="border" variant="primary" />
          <p>Loading profile...</p>
        </div>
      ) : (
        <div className="profile-card">
          <BsPersonCircle className="profile-icon" />
          {isEditing ? (
            <Form className="profile-form">
              <Form.Group controlId="firstName">
                <Form.Label>First Name</Form.Label>
                <Form.Control
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                />
              </Form.Group>
              <Form.Group controlId="lastName">
                <Form.Label>Last Name</Form.Label>
                <Form.Control
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                />
              </Form.Group>
              <Form.Group controlId="email">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </Form.Group>
              <Form.Group controlId="gender">
                <Form.Label>Gender</Form.Label>
                <Form.Control
                  as="select"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </Form.Control>
              </Form.Group>
              <Button variant="success" onClick={handleSave} className="mt-3">
                Save
              </Button>
            </Form>
          ) : (
            <div className="profile-info">
              <h4>
                {dashboardState.profile.firstName}{" "}
                {dashboardState.profile.lastName}
              </h4>
              <p>Email: {dashboardState.profile.email}</p>
              <p>Gender: {dashboardState.profile.gender}</p>
              <Button
                variant="secondary"
                onClick={handleEditToggle}
                className="edit-button"
              >
                <BsPencilSquare /> Edit
              </Button>
            </div>
          )}
        </div>
      )}
    </Container>
  );
};

export default Profile;
