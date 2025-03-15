import { Container, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Slider from "react-slick";
import "../../styles/PetPage.css";
import bird1 from "../../Assets/Images/bird1.jpg";
import bird2 from "../../Assets/Images/bird2.jpg";
import bird3 from "../../Assets/Images/bird3.jpg";

const Birds = () => {
  const navigate = useNavigate();

  const handleAdoptClick = () => {
    navigate("/adoption"); // Redirects to the adoption process page
  };

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

  const birds = [
    {
      img: bird1,
      name: "Sunny",
      description: "A cheerful parrot who loves to chat all day long!",
    },
    {
      img: bird2,
      name: "Sky",
      description: "A free-spirited canary who sings the sweetest melodies.",
    },
    {
      img: bird3,
      name: "Feather",
      description: "A curious little finch who enjoys fluttering around.",
    },
  ];

  return (
    <Container className="pet-page">
      <h1 className="pet-title">🐦 Adopt a Bird</h1>
      <p className="pet-description">
        Brighten your life with a cheerful bird companion.
      </p>
      <Slider {...sliderSettings}>
        {birds.map((bird, index) => (
          <div key={index} className="pet-card">
            <img src={bird.img} alt={bird.name} className="pet-image" />
            <h3 className="pet-name">{bird.name}</h3>
            <p className="pet-info">{bird.description}</p>
            <Button
              className="adopt-button"
              variant="primary"
              onClick={handleAdoptClick}
            >
              Start Adoption Process →
            </Button>
          </div>
        ))}
      </Slider>
    </Container>
  );
};

export default Birds;
