import { useState } from "react";
import { Container, Form, Button, Image } from "react-bootstrap";
import "../../styles/AddPet.css";

const AddPet = () => {
  const [petName, setPetName] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  // Handle image selection and preview
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  // Submit handler (replace with your API call)
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!petName || !description || !imageFile) {
      alert("Please fill all fields and select an image.");
      return;
    }

    // Create form data to send image & info to backend
    const formData = new FormData();
    formData.append("petName", petName);
    formData.append("description", description);
    formData.append("image", imageFile);

    // Example: Replace with axios POST to your backend endpoint
    // axios.post("/api/pets/create", formData, { headers: { 'Content-Type': 'multipart/form-data' } })

    alert("Pet added! (Implement backend upload)");
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

        <Button variant="primary" type="submit" className="mt-4">
          Add Pet
        </Button>
      </Form>
    </Container>
  );
};

export default AddPet;
