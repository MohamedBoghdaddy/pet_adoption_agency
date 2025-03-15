import { Container, Button, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Slider from "react-slick";
import "../../styles/PetPage.css";
import dog1 from "../../Assets/Images/dog1.jpg";
import dog2 from "../../Assets/Images/women hugging a dog.jpg";
import dog3 from "../../Assets/Images/dogHero.jpg";

const Dogs = () => {
  const navigate = useNavigate();

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    arrows: false,
    responsive: [
      { breakpoint: 1200, settings: { slidesToShow: 2 } },
      { breakpoint: 992, settings: { slidesToShow: 1 } },
    ],
  };

  const dogs = [
    {
      img: dog1,
      name: "Buddy",
      description: "A playful and loyal friend who loves belly rubs!",
    },
    {
      img: dog2,
      name: "Daisy",
      description: "A loving companion who enjoys cuddles and walks.",
    },
    {
      img: dog3,
      name: "Max",
      description: "Energetic and always ready for an adventure!",
    },
  ];

  return (
    <Container className="pet-page">
      <h1 className="pet-title">🐶 Adopt a Dog</h1>
      <p className="pet-description">
        Find your new best friend among our adorable dogs waiting for a home.
      </p>
      <Slider {...sliderSettings}>
        {dogs.map((dog, index) => (
          <div key={index} className="pet-card">
            <Card className="custom-card">
              <Card.Img variant="top" src={dog.img} className="pet-image" />
              <Card.Body>
                <Card.Title>{dog.name}</Card.Title>
                <Card.Text>{dog.description}</Card.Text>
                <Button
                  variant="primary"
                  className="adopt-button"
                  onClick={() => navigate("/adoption")}
                >
                  Start Adoption →
                </Button>
              </Card.Body>
            </Card>
          </div>
        ))}
      </Slider>
    </Container>
  );
};

export default Dogs;
