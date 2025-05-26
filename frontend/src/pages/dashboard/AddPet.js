import { useState } from "react";
import { Container, Form, Button, Image } from "react-bootstrap";
import axios from "axios";
import { toast } from "react-toastify";
import "../../styles/AddPet.css";

const API_URL =
  process.env.REACT_APP_API_URL ??
  (window.location.hostname === "localhost"
    ? "http://localhost:8000"
    : "https://pet-adoption-agency.onrender.com");

const AddPet = () => {
  const [petName, setPetName] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!petName || !description || !imageFile) {
      toast.error("Please fill all fields and select an image.");
      return;
    }

    const formData = new FormData();
    formData.append("petName", petName);
    formData.append("description", description);
    formData.append("photo", imageFile); // Ensure backend expects "photo"

    setLoading(true);

    try {
      await axios.post(`${API_URL}/api/pet/create`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      toast.success("✅ Pet added successfully!");

      // Reset form
      setPetName("");
      setDescription("");
      setImageFile(null);
      setPreviewUrl(null);
    } catch (err) {
      console.error("Add pet error:", err);
      toast.error("❌ Failed to add pet. Check console.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="add-pet-container">
      <h2>Add a New Pet</h2>
      <Form onSubmit={handleSubmit} className="add-pet-form">
        <Form.Group controlId="petName">
          <Form.Label>Pet Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter pet name"
            value={petName}
            onChange={(e) => setPetName(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group controlId="description" className="mt-3">
          <Form.Label>Description</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            placeholder="Describe the pet"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group controlId="image" className="mt-3">
          <Form.Label>Upload Image</Form.Label>
          <Form.Control
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            required
          />
        </Form.Group>

        {previewUrl && (
          <div className="image-preview mt-3">
            <Image src={previewUrl} alt="Preview" rounded fluid />
          </div>
        )}

        <Button
          variant="primary"
          type="submit"
          className="mt-4"
          disabled={loading}
        >
          {loading ? "Adding..." : "Add Pet"}
        </Button>
      </Form>
    </Container>
  );
};

export default AddPet;
