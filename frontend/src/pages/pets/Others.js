import { Container } from "react-bootstrap";
import Slider from "react-slick";
import "../../styles/PetPage.css";
import reptile1 from "../../Assets/Images/reptile1.jpg";
import hamster1 from "../../Assets/Images/hamster1.jpg";
import fish1 from "../../Assets/Images/fish1.jpg";

const Others = () => {
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

  return (
    <Container className="pet-page">
      <h1 className="pet-title">🐾 Adopt Other Pets</h1>
      <p className="pet-description">
        From reptiles to small mammals, find a unique pet today!
      </p>
      <Slider {...sliderSettings}>
        {[reptile1, hamster1, fish1].map((img, index) => (
          <div key={index} className="pet-card">
            <img src={img} alt="Pet" className="pet-image" />
          </div>
        ))}
      </Slider>
    </Container>
  );
};

export default Others;
