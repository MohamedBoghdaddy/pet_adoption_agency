import { useNavigate } from "react-router-dom";
import "../../styles/HeroSection.css"; // Ensure this file exists

const HeroSection = () => {
  const navigate = useNavigate();

  // ✅ Navigation handlers
  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <section className="hero-section">
      {/* ✅ Background Image & Overlay */}
      <div className="hero-overlay"></div>

      {/* ✅ Main Content */}
      <div className="hero-container">
        <h1 className="hero-title">
          Find your <span className="highlight">new best friend</span>
        </h1>
        <p className="hero-description">
          Browse pets from our network of over <strong>14,500</strong> shelters
          and rescues.
        </p>

        {/* ✅ Search Bar */}
        <div className="search-container">
          <input
            type="text"
            className="search-input"
            placeholder="Search Terrier, Kitten, etc."
          />
          <div className="vertical-line"></div>
          <input
            type="text"
            className="search-input"
            placeholder="Enter City, State, or ZIP"
          />
          <button className="search-button">🔍</button>
        </div>

        {/* ✅ Categories with Accessibility Fix */}
        <div className="category-cards">
          <button
            className="category-card"
            onClick={() => handleNavigation("/dogs")}
          >
            <span className="category-icon">🐶</span>
            <p className="category-text">Dogs</p>
          </button>
          <button
            className="category-card"
            onClick={() => handleNavigation("/cats")}
          >
            <span className="category-icon">🐱</span>
            <p className="category-text">Cats</p>
          </button>
          <button
            className="category-card"
            onClick={() => handleNavigation("/others")}
          >
            <span className="category-icon">🐾</span>
            <p className="category-text">Other Animals</p>
          </button>
          <a
            className="category-card"
            href="https://www.google.com/maps/dir//Pet+Zone+Veterinary+Clinic,+Egyptian+Military+Academy%D8%8C+Mostafa+Mokhtar+st.+-+Ammar+Ibn+yasser+st.+-+infront+of+MetroMarket+Heliopolis+%D8%B4%D8%A7%D8%B1%D8%B9+%D9%85%D8%B5%D8%B7%D9%81%D9%89+%D9%85%D8%AE%D8%AA%D8%A7%D8%B1+%D9%85%D8%AA%D9%81%D8%B1%D8%B9+%D9%85%D9%86,+Ammar+Ibn+Yasser,+Cairo+Governorate%E2%80%AD/@30.0007727,31.2580467,12z/data=!4m8!4m7!1m0!1m5!1m1!1s0x14581677a984463d:0xcb9d48a28e08c070!2m2!1d31.3570325!2d30.1132862?entry=ttu&g_ep=EgoyMDI1MDMxMi4wIKXMDSoASAFQAw%3D%3D"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="category-icon">🏠</span>
            <p className="category-text">Shelters & Rescues</p>
          </a>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
