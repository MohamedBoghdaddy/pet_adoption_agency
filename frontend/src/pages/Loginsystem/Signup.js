import { useState } from "react";
import axios from "axios";
import "../../styles/signup.css";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";

const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const Signup = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    middleName: "",
    lastName: "",
    gender: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [message, setMessage] = useState({ error: "", success: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setMessage({ error: "", success: "" });

    // Validation
    if (!formData.username)
      return setMessage({ error: "Username is required." });
    if (!formData.firstName || !formData.lastName)
      return setMessage({ error: "First and last name are required." });
    if (!formData.gender) return setMessage({ error: "Gender is required." });
    if (!validateEmail(formData.email))
      return setMessage({ error: "Invalid email address." });
    if (formData.password.length < 6)
      return setMessage({ error: "Password must be at least 6 characters." });
    if (formData.password !== formData.confirmPassword)
      return setMessage({ error: "Passwords do not match." });

    try {
      await axios.post("http://localhost:8000/api/users/signup", formData); // case-sensitive "signup"
      setMessage({ success: "Registration successful!" });
      navigate("/login");
    } catch (error) {
      setMessage({ error: error.response?.data?.message || "Signup failed." });
    }
  };

  return (
    <div className="main-Container">
      <div className="frame-Container">
        <div className="left-sign">
          <h2>Signup</h2>
          <form onSubmit={handleSignup}>
            {/* Basic Text Fields */}
            {[
              { name: "username", label: "Username" },
              { name: "email", label: "Email", type: "email" },
              { name: "firstName", label: "First Name" },
              { name: "middleName", label: "Middle Name" },
              { name: "lastName", label: "Last Name" },
            ].map(({ name, label, type }) => (
              <div className="field" key={name}>
                <label htmlFor={name}>{label}:</label>
                <input
                  type={type || "text"}
                  id={name}
                  name={name}
                  value={formData[name]}
                  onChange={handleChange}
                />
              </div>
            ))}

            {/* Password Fields */}
            {["password", "confirmPassword"].map((field, index) => (
              <div className="field password-container" key={field}>
                <label htmlFor={field}>
                  {index === 0 ? "Password" : "Confirm Password"}:
                </label>
                <input
                  type={
                    (index === 0 ? showPassword : showConfirmPassword)
                      ? "text"
                      : "password"
                  }
                  id={field}
                  name={field}
                  value={formData[field]}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  className="show-password"
                  onClick={() =>
                    index === 0
                      ? setShowPassword(!showPassword)
                      : setShowConfirmPassword(!showConfirmPassword)
                  }
                >
                  <i
                    className={
                      index === 0
                        ? showPassword
                          ? "fas fa-eye-slash"
                          : "fas fa-eye"
                        : showConfirmPassword
                          ? "fas fa-eye-slash"
                          : "fas fa-eye"
                    }
                  ></i>
                </button>
              </div>
            ))}

            {/* Gender Selection */}
            <div className="field">
              <label htmlFor="gender">Gender:</label>
              <div className="gender-container">
                {["male", "female", "other"].map((g) => (
                  <div key={g}>
                    <input
                      type="radio"
                      id={g}
                      name="gender"
                      value={g}
                      checked={formData.gender === g}
                      onChange={handleChange}
                    />
                    <label htmlFor={g}>
                      {g.charAt(0).toUpperCase() + g.slice(1)}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Messages */}
            {message.error && <div className="error">{message.error}</div>}
            {message.success && (
              <div className="success">{message.success}</div>
            )}

            <button className="left_btn" type="submit">
              Signup
            </button>
          </form>
        </div>

        <div className="right-sign">
          <h1>Already have an account?</h1>
          <Link to="/login">
            <Button className="right_btn" type="button">
              Login
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;
