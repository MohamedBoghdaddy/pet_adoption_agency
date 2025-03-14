import { useState } from "react";
import { Navbar, Nav, Container, NavDropdown, Modal } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faSignOutAlt, faPaw } from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../Assets/Images/pet-logo.png";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../styles/Navbar.css";
import Login from "../Loginsystem/Login.js";
import { useAuthContext } from "../../context/AuthContext";
import { useLogout } from "../../hooks/useLogout.js";

const NavBar = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const { user, isAuthenticated } = useAuthContext();
  const navigate = useNavigate();
  const { logout } = useLogout();

  const handleLoginModalOpen = () => setShowLoginModal(true);
  const handleLoginModalClose = () => setShowLoginModal(false);
  const handleNavCollapse = () => setExpanded(!expanded);
  const handleLogout = async () => {
    logout();
    navigate("/");
  };

  return (
    <Navbar
      expand="lg"
      className="custom-navbar"
      variant="dark"
      expanded={expanded}
    >
      <Container fluid>
        {/* ✅ Brand Logo */}
        <Navbar.Brand as={Link} to="/" className="navbar-brand">
          <img src={logo} alt="Company Logo" className="nav-logo" />
        </Navbar.Brand>

        {/* ✅ Toggler */}
        <Navbar.Toggle
          aria-controls="basic-navbar-nav"
          className="navbar-toggler"
          onClick={handleNavCollapse}
        />

        <Navbar.Collapse id="navbarScroll" className="navbar-collapse">
          <Nav className="navbar-nav ms-auto" navbarScroll>
            <Nav.Link
              as={Link}
              to="/"
              className="nav-link"
              onClick={handleNavCollapse}
            >
              Home
            </Nav.Link>

            {/* ✅ Dropdown for Pet Categories */}
            <NavDropdown
              title="Pets"
              id="basic-nav-dropdown"
              show={showDropdown}
              onMouseEnter={() => setShowDropdown(true)}
              onMouseLeave={() => setShowDropdown(false)}
            >
              {[
                { route: "/adopt/dogs", label: "Dogs" },
                { route: "/adopt/cats", label: "Cats" },
                { route: "/adopt/birds", label: "Birds" },
                { route: "/adopt/bunnies", label: "Bunnies" },
                { route: "/adopt/others", label: "Others" },
              ].map(({ route, label }) => (
                <NavDropdown.Item
                  key={route}
                  as={Link}
                  to={route}
                  className="nav-link-products"
                  onClick={handleNavCollapse}
                >
                  {label}
                </NavDropdown.Item>
              ))}
            </NavDropdown>

            <Nav.Link
              as={Link}
              to="/about"
              className="nav-link"
              onClick={handleNavCollapse}
            >
              About Us
            </Nav.Link>

            <Nav.Link
              as={Link}
              to="/contact"
              className="nav-link"
              onClick={handleNavCollapse}
            >
              Contact Us
            </Nav.Link>

            {isAuthenticated && (
              <Nav.Link
                as={Link}
                to="/my-applications"
                className="nav-link"
                onClick={handleNavCollapse}
              >
                My Applications
              </Nav.Link>
            )}

            {/* ✅ Auth Section */}
            {isAuthenticated ? (
              <Nav.Link className="nav-link" onClick={handleLogout}>
                <FontAwesomeIcon icon={faSignOutAlt} /> Logout
              </Nav.Link>
            ) : (
              <Nav.Link className="nav-link" onClick={handleLoginModalOpen}>
                <FontAwesomeIcon icon={faUser} /> Login
              </Nav.Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>

      {/* ✅ Login Modal */}
      <Modal show={showLoginModal} onHide={handleLoginModalClose} centered>
        <Modal.Header closeButton></Modal.Header>
        <Modal.Body>
          <Login />
        </Modal.Body>
      </Modal>
    </Navbar>
  );
};

export default NavBar;
