import  { useState } from "react";
import axios from "axios";
import { Container, Form, Button } from "react-bootstrap";
import "../../styles/Adoption.css";

const Adoption = ({ user }) => {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    petPreference: "",
    reason: "",
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setForm((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:4000/api/adoption/create", {
        ...form,
        userId: user._id,
      });
      alert("Request submitted! Wait for admin approval.");
      setForm({
        fullName: "",
        email: "",
        phone: "",
        address: "",
        petPreference: "",
        reason: "",
      });
    } catch (error) {
      console.error("Adoption request error:", error);
      alert("Failed to submit request. Please try again.");
    }
  };

  return (
    <Container className="adoption-page">
      <h1 className="adoption-title">🐾 Adoption Process</h1>
      <p className="adoption-description">
        Fill out the form to bring home your new best friend!
      </p>
      <Form className="adoption-form" onSubmit={handleSubmit}>
        {/* Full Name */}
        <Form.Group controlId="fullName">
          <Form.Label>Full Name</Form.Label>
          <Form.Control
            type="text"
            value={form.fullName}
            onChange={handleChange}
            placeholder="Enter your full name"
            required
          />
        </Form.Group>

        {/* Email */}
        <Form.Group controlId="email">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Enter your email"
            required
          />
        </Form.Group>

        {/* Phone */}
        <Form.Group controlId="phone">
          <Form.Label>Phone Number</Form.Label>
          <Form.Control
            type="tel"
            value={form.phone}
            onChange={handleChange}
            placeholder="Enter your phone number"
            required
          />
        </Form.Group>

        {/* Address */}
        <Form.Group controlId="address">
          <Form.Label>Address</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            value={form.address}
            onChange={handleChange}
            placeholder="Enter your address"
            required
          />
        </Form.Group>

        {/* Pet Preference */}
        <Form.Group controlId="petPreference">
          <Form.Label>Which pet are you interested in?</Form.Label>
          <Form.Control
            as="select"
            value={form.petPreference}
            onChange={handleChange}
            required
          >
            <option value="">Select a pet</option>
            <option>Buddy (Dog)</option>
            <option>Daisy (Dog)</option>
            <option>Max (Dog)</option>
            <option>Any available pet</option>
          </Form.Control>
        </Form.Group>

        {/* Reason for Adoption */}
        <Form.Group controlId="reason">
          <Form.Label>Why do you want to adopt?</Form.Label>
          <Form.Control
            as="textarea"
            rows={4}
            value={form.reason}
            onChange={handleChange}
            placeholder="Tell us why you want to adopt a pet"
            required
          />
        </Form.Group>

        {/* Submit Button */}
        <Button type="submit" variant="primary" className="submit-btn">
          Submit Application
        </Button>
      </Form>
    </Container>
  );
};

export default Adoption;
