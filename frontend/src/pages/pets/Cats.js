import { Container, Button } from "react-bootstrap";
import Slider from "react-slick";
import { useNavigate } from "react-router-dom";
import "../../styles/PetPage.css";
import cat1 from "../../Assets/Images/ruthie.jpg";
import cat2 from "../../Assets/Images/splinter.jpg";
import cat3 from "../../Assets/Images/kane.jpg";

const Cats = () => {
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

  const catData = [
    {
      img: cat1,
      name: "Ruthie",
      description: "A playful and cuddly friend who loves belly rubs! 🐾",
    },
    {
      img: cat2,
      name: "Splinter",
      description: "A smart and curious explorer with a love for adventure. 🌍",
    },
    {
      img: cat3,
      name: "Kane",
      description: "A calm and affectionate cat who enjoys lazy afternoons. ☀️",
    },
  ];

  return (
    <Container className="pet-page">
      <h1 className="pet-title">🐱 Adopt a Cat</h1>
      <p className="pet-description">
        Find a purr-fect feline friend to bring joy into your home.
      </p>
      <Slider {...sliderSettings}>
        {catData.map((cat, index) => (
          <div key={index} className="pet-card">
            <img src={cat.img} alt={cat.name} className="pet-image" />
            <h3 className="pet-name">{cat.name}</h3>
            <p className="pet-info">{cat.description}</p>
            <Button className="adopt-button" onClick={handleAdoptClick}>
              Adopt Me 🏡
            </Button>
          </div>
        ))}
      </Slider>
    </Container>
  );
};

export default Cats;
