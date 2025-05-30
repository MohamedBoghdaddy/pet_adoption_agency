import {  Card, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Slider from "react-slick";
import "../../styles/StorytellingSection.css";

import dogHappy from "../../Assets/Images/white dog and white cat.jpg";
import dogCute from "../../Assets/Images/cuteCate.jpg";
import bestFriend from "../../Assets/Images/women hugging a dog.jpg";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const StorytellingSection = () => {
  const navigate = useNavigate();

  // ✅ Redirect to Adoption Process
  const handleAdoptClick = () => {
    navigate("/adoption");
  };

  // ✅ Slider Settings (Dots Only, No Numbers)
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

  // ✅ Data for Story Cards
  const stories = [
    {
      img: dogHappy,
      title: "They bring happiness",
      text: "Imagine coming home and having them waiting for you. That will make your heart melt!",
    },
    {
      img: dogCute,
      title: "They’re cute!",
      text: "No one dares to resist their cuteness.",
    },
    {
      img: bestFriend,
      title: "Your best friend",
      text: "They’ll be by your side 24/7, listening without complaining.",
    },
  ];

  return (
    <section className="storytelling-section">
      <h2 className="section-title">
        Why <span className="highlight">Adopt a Pet?</span>
      </h2>

      <Slider {...sliderSettings}>
        {stories.map((story, index) => (
          <div key={index} className="card-container">
            <Card className="custom-card">
              <Card.Img variant="top" src={story.img} className="pet-image" />
              <Card.Body>
                <Card.Title>{story.title}</Card.Title>
                <Card.Text>{story.text}</Card.Text>
                <Button
                  variant="dark"
                  onClick={handleAdoptClick}
                  className="adopt-button"
                >
                  Start Adopting →
                </Button>
              </Card.Body>
            </Card>
          </div>
        ))}
      </Slider>
    </section>
  );
};

export default StorytellingSection;
