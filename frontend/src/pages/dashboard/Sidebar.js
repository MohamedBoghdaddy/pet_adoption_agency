// src/components/Sidebar.js
import React, { useState, useEffect, useRef } from "react";
import AvatarEditor from "react-avatar-editor";
import { Link } from "react-router-dom";
import {
  FaPaw,
  FaChartLine,
  FaTools,
  FaEye,
  FaEdit,
  FaUsers,
} from "react-icons/fa";
import { BsPersonCircle } from "react-icons/bs";
import { Modal, Button } from "react-bootstrap";
import "../../styles/Sidebar.css";
import { useAuthContext } from "../../context/AuthContext";
import axios from "axios";

const Sidebar = () => {
  const { state } = useAuthContext();
  const { user, isAuthenticated } = state;

  const [profilePhoto, setProfilePhoto] = useState(user?.profilePhoto || null);
  const [image, setImage] = useState(null);
  const [scale, setScale] = useState(1.2);
  const [rotate, setRotate] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [error, setError] = useState("");

  const editorRef = useRef(null);

  useEffect(() => {
    const savedProfilePhoto = localStorage.getItem("profilePhoto");
    if (savedProfilePhoto) {
      setProfilePhoto(savedProfilePhoto);
    } else if (user?.profilePhoto) {
      setProfilePhoto(user.profilePhoto);
    }
  }, [user]);

  const toggleEdit = () => {
    setIsEditing((prev) => !prev);
    setImage(null);
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(file);
      setError("");
      localStorage.removeItem("profilePhoto");
    }
  };

  const handleSave = async () => {
    if (editorRef.current) {
      const canvas = editorRef.current.getImageScaledToCanvas();
      const dataUrl = canvas.toDataURL();

      try {
        const blob = await fetch(dataUrl).then((res) => res.blob());
        const formData = new FormData();
        formData.append("photoFile", blob, "profile-photo.png");

        const response = await axios.put(
          `http://localhost:8000/api/users/update/${user._id}`,
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );

        const updatedProfilePhoto = response.data.user.profilePhoto;
        setProfilePhoto(updatedProfilePhoto);
        localStorage.setItem("profilePhoto", updatedProfilePhoto);
        setIsEditing(false);
      } catch (error) {
        console.error("Error uploading profile photo:", error);
        setError("Failed to upload profile photo. Please try again.");
      }
    }
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2>
          {isAuthenticated && user ? `Welcome, ${user.username}` : "Guest"}
        </h2>

        {isAuthenticated && (
          <div className="profile-photo-section">
            {profilePhoto || isEditing ? (
              <>
                <img
                  src={`http://localhost:8000${profilePhoto}`}
                  alt="Profile"
                  className="profile-photo"
                />
                <div className="icon-buttons">
                  <button onClick={toggleEdit}>
                    <FaEdit />
                  </button>
                  <button onClick={() => setShowPreview(true)}>
                    <FaEye />
                  </button>
                </div>
              </>
            ) : (
              <p>No Profile Photo</p>
            )}

            {isEditing && (
              <>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                />
                {image && (
                  <div className="avatar-editor">
                    <AvatarEditor
                      ref={editorRef}
                      image={image}
                      width={150}
                      height={150}
                      border={30}
                      borderRadius={100}
                      color={[255, 255, 255, 0.6]}
                      scale={scale}
                      rotate={rotate}
                      style={{ boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)" }}
                    />
                    <div className="controls">
                      <input
                        type="range"
                        min="1"
                        max="3"
                        step="0.1"
                        value={scale}
                        onChange={(e) => setScale(parseFloat(e.target.value))}
                      />
                      <Button
                        variant="secondary"
                        onClick={() => setRotate((prev) => prev + 90)}
                      >
                        Rotate
                      </Button>
                      <Button variant="success" onClick={handleSave}>
                        Save Photo
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}

            {error && <p className="error-message">{error}</p>}
          </div>
        )}
      </div>

      <Modal show={showPreview} onHide={() => setShowPreview(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Profile Photo Preview</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          <img
            src={`http://localhost:8000${profilePhoto}`}
            alt="Profile Preview"
            className="img-fluid"
            style={{ maxWidth: "100%", borderRadius: "50%" }}
          />
        </Modal.Body>
      </Modal>

      <ul className="sidebar-menu">
        <li>
          <Link to="/dashboard">
            <FaPaw /> Dashboard
          </Link>
        </li>

        {isAuthenticated && user?.role === "admin" && (
          <>
            <li>
              <Link to="/reports">
                <FaChartLine /> Adoption Reports
              </Link>
            </li>
            <li>
              <Link to="/employees">
                <FaUsers /> Staff
              </Link>
            </li>
            <li>
              <Link to="/addpet">
                <FaPaw /> Add Pet
              </Link>
            </li>
            <li>
              <Link to="/setting">
                <FaTools /> Settings
              </Link>
            </li>
            <li>
              <Link to="/pets">
                <FaPaw /> pets
              </Link>
            </li>
          </>
        )}

        {isAuthenticated && user?.role === "user" && (
          <>
            <li>
              <Link to="/profile">
                <BsPersonCircle /> Profile
              </Link>
            </li>
            <li>
              <Link to="/Adoption">
                <FaPaw /> Adoption
              </Link>
            </li>
            <li>
              <Link to="/myapplication">
                <FaPaw /> My Application
              </Link>
            </li>
          </>
        )}
      </ul>
    </div>
  );
};

export default React.memo(Sidebar);
