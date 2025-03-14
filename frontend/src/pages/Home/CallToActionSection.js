import { Container, Row, Col, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "../../styles/CallToActionSection.css";

const CallToActionSection = () => {
  const navigate = useNavigate();

  const handleAdoptClick = () => {
    navigate("/adopt");
  };

  return (
    <section className="cta-section">
      <Container>
        <Row className="cta-content">
          <Col md={8}>
            <h2 className="cta-title">Ready to Adopt?</h2>
            <p className="cta-description">
              Give a loving home to a pet in need. Start your adoption journey
              today!
            </p>
          </Col>
          <Col md={4} className="cta-button">
           <h2>Learn the basics before adopting!</h2>
            <Button>How to take care →</Button>
            <Button variant="dark" onClick={handleAdoptClick}>
              Start Adopting →
            </Button>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default CallToActionSection;
