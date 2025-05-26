import { useState } from "react";
import axios from "axios";
import { Container, Form, Button, Alert, Spinner } from "react-bootstrap";
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
    if (!form.reason.trim() || form.reason.length < 20) {
      newErrors.reason =
        "Please provide a detailed reason (at least 20 characters)";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setForm((prev) => ({ ...prev, [id]: value }));
    // Clear error when user starts typing
    if (errors[id]) {
      setErrors((prev) => ({ ...prev, [id]: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;
    if (!user?._id) {
      setSubmitStatus({
        success: false,
        message: "You must be logged in to submit an adoption request",
      });
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus({ success: null, message: "" });

    try {
      const response = await axios.post(
        "http://localhost:8000/api/adoption/create",
        {
          ...form,
          userId: user._id,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 201) {
        setSubmitStatus({
          success: true,
          message:
            "Request submitted successfully! Our team will review your application shortly.",
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
      console.error("Adoption request error:", error);
      const errorMessage =
        error.response?.data?.message ||
        "Failed to submit request. Please try again later.";
      setSubmitStatus({
        success: false,
        message: errorMessage,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container className="adoption-page">
      <h1 className="adoption-title">🐾 Adoption Application</h1>
      <p className="adoption-description">
        Please complete this form to begin the adoption process. We'll review
        your application and contact you within 3-5 business days.
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
            placeholder="Enter your full name"
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
            placeholder="Enter your email"
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
            placeholder="Enter your phone number (e.g., 123-456-7890)"
            isInvalid={!!errors.phone}
            required
          />
          <Form.Control.Feedback type="invalid">
            {errors.phone}
          </Form.Control.Feedback>
        </Form.Group>

        {/* Address */}
        <Form.Group controlId="address" className="mb-3">
          <Form.Label>Full Address</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            value={form.address}
            onChange={handleChange}
            placeholder="Enter your full address including city and zip code"
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
            <option value="Buddy (Dog)">
              Buddy (Dog) - Golden Retriever, 2 years
            </option>
            <option value="Daisy (Dog)">Daisy (Dog) - Beagle, 1.5 years</option>
            <option value="Max (Dog)">Max (Dog) - Labrador, 3 years</option>
            <option value="Whiskers (Cat)">
              Whiskers (Cat) - Tabby, 4 years
            </option>
            <option value="Any available pet">
              I'm open to any available pet
            </option>
          </Form.Control>
          <Form.Control.Feedback type="invalid">
            {errors.petPreference}
          </Form.Control.Feedback>
        </Form.Group>

        {/* Reason for Adoption */}
        <Form.Group controlId="reason" className="mb-4">
          <Form.Label>Tell us about why you want to adopt</Form.Label>
          <Form.Control
            as="textarea"
            rows={4}
            value={form.reason}
            onChange={handleChange}
            placeholder="Please share your reasons for adoption, your experience with pets, and your home environment"
            isInvalid={!!errors.reason}
            required
          />
          <Form.Control.Feedback type="invalid">
            {errors.reason}
          </Form.Control.Feedback>
          <Form.Text muted>
            Minimum 20 characters. The more details you provide, the better we
            can match you with a pet.
          </Form.Text>
        </Form.Group>

        {/* Submit Button */}
        <Button
          type="submit"
          variant="primary"
          className="submit-btn"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
                className="me-2"
              />
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
