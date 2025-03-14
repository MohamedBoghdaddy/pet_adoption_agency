import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebookF,
  faLinkedin,
  faInstagram,
} from "@fortawesome/free-brands-svg-icons";

import "../../styles/Footer.css";
import "../../App.css";

function Footer() {
  return (
    <section className="footer">
      <div className="footer-container">
        {/* ✅ Pet Adoption Branding & Mission */}
        <div className="footer-col">
          <h4>AdoptMe</h4>
          <p>
            Give a loving home to a pet in need. At AdoptMe, we connect rescued
            animals with families ready to provide care and companionship.
            Browse available pets and start your adoption journey today!
          </p>
          <div className="icons">
            <a href="https://www.facebook.com/adoptme">
              <FontAwesomeIcon icon={faFacebookF} />
            </a>{" "}
            <a href="https://www.instagram.com/adoptme">
              <FontAwesomeIcon icon={faInstagram} />
            </a>
            <a href="https://www.linkedin.com/company/adoptme">
              <FontAwesomeIcon icon={faLinkedin} />
            </a>
          </div>
        </div>

        {/* ✅ Newsletter for Adoption Updates */}
        <div className="footer-col">
          <h4>Subscribe for Adoption Updates</h4>
          <form className="newsletter-form">
            <input type="email" placeholder="Enter your email" />
            <button type="submit">Subscribe</button>
          </form>
        </div>
      </div>
    </section>
  );
}

export default Footer;
