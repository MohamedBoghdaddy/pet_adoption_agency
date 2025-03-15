import { Container, Form, Button } from "react-bootstrap";
import "../../styles/Adoption.css";

const Adoption = () => {
  return (
    <Container className="adoption-page">
      <h1 className="adoption-title">🐾 Adoption Process</h1>
      <p className="adoption-description">
        Fill out the form to bring home your new best friend!
      </p>
      <Form className="adoption-form">
        {/* Name */}
        <Form.Group controlId="name">
          <Form.Label>Full Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter your full name"
            required
          />
        </Form.Group>

        {/* Email */}
        <Form.Group controlId="email">
          <Form.Label>Email</Form.Label>
          <Form.Control type="email" placeholder="Enter your email" required />
        </Form.Group>

        {/* Phone */}
        <Form.Group controlId="phone">
          <Form.Label>Phone Number</Form.Label>
          <Form.Control
            type="tel"
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
            placeholder="Enter your address"
            required
          />
        </Form.Group>

        {/* Pet Preference */}
        <Form.Group controlId="petPreference">
          <Form.Label>Which pet are you interested in?</Form.Label>
          <Form.Control as="select">
            <option>Buddy (Dog)</option>
            <option>Daisy (Dog)</option>
            <option>Max (Dog)</option>
            <option>Any available pet</option>
          </Form.Control>
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
