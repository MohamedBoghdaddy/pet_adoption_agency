import { useState } from "react";
import axios from "axios";
import { Container, Form, Button, Alert, Spinner } from "react-bootstrap";
import "../../styles/Adoption.css";
import Cookies from "js-cookie";

const Adoption = () => {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    petPreference: "",
    reason: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({
    success: null,
    message: "",
  });
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;

    if (!form.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!emailRegex.test(form.email))
      newErrors.email = "Valid email is required";
    if (!phoneRegex.test(form.phone))
      newErrors.phone = "Valid phone number is required";
    if (!form.address.trim()) newErrors.address = "Address is required";
    if (!form.petPreference)
      newErrors.petPreference = "Pet selection is required";
    if (!form.reason.trim() || form.reason.length < 20)
      newErrors.reason =
        "Please provide a detailed reason (at least 20 characters)";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setForm((prev) => ({ ...prev, [id]: value }));

    if (errors[id]) {
      setErrors((prev) => ({ ...prev, [id]: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitStatus({ success: null, message: "" });

    if (!validateForm()) return;

    const token = localStorage.getItem("token") || Cookies.get("token");
    if (!token) {
      setSubmitStatus({
        success: false,
        message: "You must be logged in to submit an adoption request.",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await axios.post(
        "http://localhost:8000/api/adoption/requests/create",
        {
          petName: form.petPreference,
          petType: form.petPreference.toLowerCase().includes("cat")
            ? "cat"
            : "dog",
          reason: form.reason,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      if (response.status === 201) {
        setSubmitStatus({
          success: true,
          message: "Request submitted successfully!",
        });
        setForm({
          fullName: "",
          email: "",
          phone: "",
          address: "",
          petPreference: "",
          reason: "",
        });
      }
    } catch (error) {
      console.error("❌ Adoption request error:", error);
      const errorMessage =
        error.response?.data?.message || "Failed to submit request. Try again.";
      setSubmitStatus({ success: false, message: errorMessage });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container className="adoption-page">
      <h1 className="adoption-title">🐾 Adoption Application</h1>
      <p className="adoption-description">
        Please complete this form to begin the adoption process. We'll review
        your application and contact you shortly.
      </p>

      {submitStatus.success !== null && (
        <Alert variant={submitStatus.success ? "success" : "danger"}>
          {submitStatus.message}
        </Alert>
      )}

      <Form className="adoption-form" onSubmit={handleSubmit} noValidate>
        {/* Full Name */}
        <Form.Group controlId="fullName" className="mb-3">
          <Form.Label>Full Name</Form.Label>
          <Form.Control
            type="text"
            value={form.fullName}
            onChange={handleChange}
            isInvalid={!!errors.fullName}
            required
          />
          <Form.Control.Feedback type="invalid">
            {errors.fullName}
          </Form.Control.Feedback>
        </Form.Group>

        {/* Email */}
        <Form.Group controlId="email" className="mb-3">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            value={form.email}
            onChange={handleChange}
            isInvalid={!!errors.email}
            required
          />
          <Form.Control.Feedback type="invalid">
            {errors.email}
          </Form.Control.Feedback>
        </Form.Group>

        {/* Phone */}
        <Form.Group controlId="phone" className="mb-3">
          <Form.Label>Phone Number</Form.Label>
          <Form.Control
            type="tel"
            value={form.phone}
            onChange={handleChange}
            isInvalid={!!errors.phone}
            required
          />
          <Form.Control.Feedback type="invalid">
            {errors.phone}
          </Form.Control.Feedback>
        </Form.Group>

        {/* Address */}
        <Form.Group controlId="address" className="mb-3">
          <Form.Label>Address</Form.Label>
          <Form.Control
            as="textarea"
            rows={2}
            value={form.address}
            onChange={handleChange}
            isInvalid={!!errors.address}
            required
          />
          <Form.Control.Feedback type="invalid">
            {errors.address}
          </Form.Control.Feedback>
        </Form.Group>

        {/* Pet Preference */}
        <Form.Group controlId="petPreference" className="mb-3">
          <Form.Label>Which pet are you interested in?</Form.Label>
          <Form.Control
            as="select"
            value={form.petPreference}
            onChange={handleChange}
            isInvalid={!!errors.petPreference}
            required
          >
            <option value="">Select a pet</option>
            <option value="Buddy (Dog)">Buddy (Dog)</option>
            <option value="Daisy (Dog)">Daisy (Dog)</option>
            <option value="Max (Dog)">Max (Dog)</option>
            <option value="Whiskers (Cat)">Whiskers (Cat)</option>
            <option value="Any available pet">Any available pet</option>
          </Form.Control>
          <Form.Control.Feedback type="invalid">
            {errors.petPreference}
          </Form.Control.Feedback>
        </Form.Group>

        {/* Reason */}
        <Form.Group controlId="reason" className="mb-4">
          <Form.Label>Why do you want to adopt?</Form.Label>
          <Form.Control
            as="textarea"
            rows={4}
            value={form.reason}
            onChange={handleChange}
            isInvalid={!!errors.reason}
            required
          />
          <Form.Control.Feedback type="invalid">
            {errors.reason}
          </Form.Control.Feedback>
        </Form.Group>

        {/* Submit */}
        <Button type="submit" variant="primary" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Spinner animation="border" size="sm" className="me-2" />
              Submitting...
            </>
          ) : (
            "Submit Application"
          )}
        </Button>
      </Form>
    </Container>
  );
};

export default Adoption;
