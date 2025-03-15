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
          <Col md={8} className="cta-text">
            <h2 className="cta-title">
              <span className="highlight">Ready</span> to Adopt?
            </h2>
            <p className="cta-description">
              Give a loving home to a pet in need. Start your adoption journey
              today!
            </p>
          </Col>
          <Col md={4} className="cta-actions">
            <h3 className="cta-subtitle">Learn the basics before adopting!</h3>
            <div className="cta-buttons">
              <Button className="btn-light">How to Take Care →</Button>
              <Button variant="dark" onClick={handleAdoptClick}>
                Start Adopting →
              </Button>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default CallToActionSection;