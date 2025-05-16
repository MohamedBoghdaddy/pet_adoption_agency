import { Container, Button } from "react-bootstrap";
import Slider from "react-slick";
import "../../styles/PetPage.css";
import reptile1 from "../../Assets/Images/reptile1.jpg";
import hamster1 from "../../Assets/Images/hamster1.jpg";
import fish1 from "../../Assets/Images/fish1.jpg";
import { useNavigate } from "react-router-dom";

const Others = () => {
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

  // 🐾 Descriptions for each image
  const petData = [
    {
      img: reptile1,
      description:
        "🌿 Meet Slinky! A calm reptile who loves to bask in the sun.",
    },
    {
      img: hamster1,
      description:
        "🌀 Say hi to Nibbles! A playful hamster who spins with joy.",
    },
    {
      img: fish1,
      description:
        "🌊 Splash is a shimmering fish who brings peace and beauty.",
    },
  ];

  return (
    <Container className="pet-page">
      <h1 className="pet-title">🐾 Adopt Other Pets</h1>
      <p className="pet-description">
        From reptiles to small mammals, find a unique pet today!
      </p>
      <Slider {...sliderSettings}>
        {petData.map((pet, index) => (
          <div key={index} className="pet-card">
            <img src={pet.img} alt="Pet" className="pet-image" />
            <p className="pet-info">{pet.description}</p>
            <Button
              variant="primary"
              className="adopt-button"
              onClick={() => navigate("/adoption")}
            >
              Start Adoption →
            </Button>
          </div>
        ))}
      </Slider>
    </Container>
  );
};

export default Others;
