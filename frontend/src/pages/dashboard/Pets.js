import { useEffect, useState } from "react";
import { Container, Row, Col, Card, Spinner, Alert } from "react-bootstrap";
import { fetchPets } from "../../services/petServices";
import "../../styles/Pets.css"; // optional styling

const Pets = () => {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadPets = async () => {
      try {
        const data = await fetchPets();
        setPets(data);
      } catch (err) {
        setError("Failed to load pets.");
      } finally {
        setLoading(false);
      }
    };

    loadPets();
  }, []);

  if (loading) {
    return (
      <Container className="pt-5 text-center">
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="pt-5">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container className="pt-5">
      <h2 className="mb-4 text-center">🐾 Available Pets for Adoption</h2>
      <Row>
        {pets.length > 0 ? (
          pets.map((pet) => (
            <Col key={pet._id} md={4} className="mb-4">
              <Card className="h-100 shadow">
                <Card.Img
                  variant="top"
                  src={pet.images?.[0] || "/placeholder.jpg"}
                  style={{ height: "250px", objectFit: "cover" }}
                />
                <Card.Body>
                  <Card.Title>{pet.name}</Card.Title>
                  <Card.Text>{pet.description}</Card.Text>
                  <p className="text-muted">Category: {pet.category}</p>
                </Card.Body>
              </Card>
            </Col>
          ))
        ) : (
          <p>No pets found.</p>
        )}
      </Row>
    </Container>
  );
};

export default Pets;
