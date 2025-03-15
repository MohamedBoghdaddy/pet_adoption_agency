import { Container } from "react-bootstrap";
import "../../styles/HowTo.css";

const HowTo = () => {
  return (
    <Container className="how-to-page">
      <h1 className="how-to-title">🐾 Ready to Adopt?</h1>
      <p className="how-to-intro">
        Adopting a pet is a rewarding experience, but it's important to be
        prepared! Here's what you need to know before welcoming your new furry
        friend.
      </p>

      <div className="how-to-section">
        <h2 className="how-to-subtitle">🏡 Provide a Safe Space</h2>
        <p className="how-to-text">
          Your new pet will need time to adjust. Create a comfortable area in
          your home where they can feel safe and relaxed.
        </p>
      </div>

      <div className="how-to-section">
        <h2 className="how-to-subtitle">🥗 Healthy Diet & Nutrition</h2>
        <p className="how-to-text">
          Make sure to provide nutritious food suitable for your pet’s breed and
          age. Fresh water should always be available.
        </p>
      </div>

      <div className="how-to-section">
        <h2 className="how-to-subtitle">🐶🐱 Veterinary Care</h2>
        <p className="how-to-text">
          Regular checkups, vaccinations, and proper healthcare are crucial for
          keeping your pet happy and healthy.
        </p>
      </div>

      <div className="how-to-section">
        <h2 className="how-to-subtitle">🐕 Daily Exercise & Playtime</h2>
        <p className="how-to-text">
          Pets need mental stimulation and physical activity. Make time for
          walks, play sessions, and social interactions.
        </p>
      </div>

      <div className="how-to-section">
        <h2 className="how-to-subtitle">❤️ Patience & Love</h2>
        <p className="how-to-text">
          Adjusting to a new home can take time. Be patient, loving, and
          consistent in training to build a lifelong bond.
        </p>
      </div>
    </Container>
  );
};

export default HowTo;
