import { useState, useEffect } from "react";
import {
  Navbar,
  Nav,
  Container,
  NavDropdown,
  Modal,
  Form,
  Row,
  Col,
  Button,
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Link as ScrollLink } from "react-scroll";
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
  const [searchTerm, setSearchTerm] = useState("");
  const location = useLocation();

  const { state } = useAuthContext();
  const { user, isAuthenticated } = state;
  const navigate = useNavigate();
  const { logout } = useLogout();

  const handleLoginModalOpen = () => setShowLoginModal(true);
  const handleLoginModalClose = () => setShowLoginModal(false);
  const handleNavCollapse = () => setExpanded(!expanded);

  const handleLogout = async () => {
    logout();
    navigate("/");
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm) {
      navigate(`/workspaces?term=${searchTerm}`);
    }
  };
  // Close mobile menu on route change
  useEffect(() => {
    setExpanded(false);
  }, [location.pathname]);

  return (
    <Navbar
      expand="lg"
      className="custom-navbar"
      variant="dark"
      expanded={expanded}
    >
      <Container fluid>
        <Navbar.Brand as={Link} to="/" className="navbar-brand">
          <img src={logo} alt="Company Logo" className="nav-logo" />
        </Navbar.Brand>

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

            <NavDropdown
              title="Pets"
              id="pets-dropdown"
              show={showDropdown}
              onMouseEnter={() => setShowDropdown(true)}
              onMouseLeave={() => setShowDropdown(false)}
            >
              {[
                { route: "/Dogs", label: "Dogs" },
                { route: "/Cats", label: "Cats" },
                { route: "/Birds", label: "Birds" },
                { route: "/Bunnies", label: "Bunnies" },
                { route: "/Others", label: "Others" },
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

            <ScrollLink
              to="WhoWeAre"
              smooth
              className="nav-link"
              onClick={handleNavCollapse}
            >
              WHO WE ARE
            </ScrollLink>

            {isAuthenticated && user && (
              <Nav.Link
                as={Link}
                to="/dashboard"
                className="nav-link"
                onClick={handleNavCollapse}
              >
                Dashboard
              </Nav.Link>
            )}

            <Nav.Link
              as={Link}
              to="/contact"
              className={`nav-link ${
                location.pathname === "/contact" ? "active" : ""
              }`}
              onClick={() => setExpanded(false)}
            >
              Contact
            </Nav.Link>

            {isAuthenticated && user?.role === "user" && (
              <Nav.Link
                as={Link}
                to="/MyApplication"
                className="nav-link"
                onClick={handleNavCollapse}
              >
                My Applications
              </Nav.Link>
            )}

            {/* Search Form */}
            <Form inline onSubmit={handleSearchSubmit} className="ms-3">
              <Row>
                <Col xs="auto">
                  <Form.Control
                    type="text"
                    placeholder="Search pets"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </Col>
                <Col xs="auto">
                  <Button variant="outline-light" type="submit">
                    Search
                  </Button>
                </Col>
              </Row>
            </Form>

            {/* Auth Buttons */}
            {isAuthenticated && user ? (
              <Nav.Link
                role="button"
                tabIndex={0}
                onClick={handleLogout}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") handleLogout();
                }}
                className="nav-link logout-link"
              >
                <FontAwesomeIcon icon={faSignOutAlt} /> Logout
              </Nav.Link>
            ) : (
              <Nav.Link
                role="button"
                tabIndex={0}
                onClick={() => {
                  handleLoginModalOpen();
                  setExpanded(false);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ")
                    handleLoginModalOpen();
                }}
                className="nav-link login-link"
              >
                <FontAwesomeIcon icon={faUser} /> Login
              </Nav.Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>

      <Modal show={showLoginModal} onHide={handleLoginModalClose} centered>
        <Modal.Header closeButton></Modal.Header>
        <Modal.Body>
          <Login onLoginSuccess={handleLoginModalClose} />
        </Modal.Body>
      </Modal>
    </Navbar>
  );
};

export default NavBar;
