import React from "react";
import "../../styles/HeroSection.css"; // Ensure this file exists

const HeroSection = () => {
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

        {/* ✅ Categories */}
        <div className="category-cards">
          <div className="category-card">
            <span className="category-icon">🐶</span>
            <p className="category-text">Dogs</p>
          </div>
          <div className="category-card">
            <span className="category-icon">🐱</span>
            <p className="category-text">Cats</p>
          </div>
          <div className="category-card">
            <span className="category-icon">🐾</span>
            <p className="category-text">Other Animals</p>
          </div>
          <div className="category-card">
            <span className="category-icon">🏠</span>
            <p className="category-text">Shelters & Rescues</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
