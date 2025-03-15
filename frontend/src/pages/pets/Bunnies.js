import { Container, Button } from "react-bootstrap";
import Slider from "react-slick";
import { useNavigate } from "react-router-dom";
import "../../styles/PetPage.css";
import bunny1 from "../../Assets/Images/bunny1.jpg";
import bunny2 from "../../Assets/Images/bunny2.jpg";
import bunny3 from "../../Assets/Images/bunny3.jpg";

const Bunnies = () => {
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

  const bunnyData = [
    {
      img: bunny1,
      name: "Fluffy",
      description: "A soft and cuddly bunny that loves to hop around! 🐾",
    },
    {
      img: bunny2,
      name: "Snowball",
      description: "An energetic little furball who enjoys playtime! ❄️",
    },
    {
      img: bunny3,
      name: "Binky",
      description: "A gentle bunny that enjoys head rubs and quiet moments. 💤",
    },
  ];

  return (
    <Container className="pet-page">
      <h1 className="pet-title">🐰 Adopt a Bunny</h1>
      <p className="pet-description">
        Adopt an adorable bunny and enjoy their playful energy.
      </p>
      <Slider {...sliderSettings}>
        {bunnyData.map((bunny, index) => (
          <div key={index} className="pet-card">
            <img src={bunny.img} alt={bunny.name} className="pet-image" />
            <h3 className="pet-name">{bunny.name}</h3>
            <p className="pet-info">{bunny.description}</p>
            <Button className="adopt-button" onClick={handleAdoptClick}>
              Adopt Me 🏡
            </Button>
          </div>
        ))}
      </Slider>
    </Container>
  );
};

export default Bunnies;
