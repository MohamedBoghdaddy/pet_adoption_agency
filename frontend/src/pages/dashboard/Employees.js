// Employees.js (now Staff.js)
import { useState, useEffect } from "react";
import { BsPersonBadge, BsSearch, BsThreeDotsVertical } from "react-icons/bs";
import useDashboard from "../../hooks/useDashboard";
import { useAuthContext } from "../../context/AuthContext";
import { Button, Form, Modal, Spinner, Alert } from "react-bootstrap";
import "../../styles/Employee.css";

const Staff = () => {
  const { user } = useAuthContext();
  const {
    state,
    fetchDashboardData,
    handleUpdateEmployee,
    handleCreateEmployee,
    handleDeleteEmployee,
  } = useDashboard();

  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const [selectedEmployee, setSelectedEmployee] = useState({
    fname: "",
    lname: "",
    email: "",
    role: "staff",
    position: "",
  });

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const filteredEmployees =
    state.employees?.filter((employee) =>
      `${employee.fname} ${employee.lname}`
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
    ) || [];

  const handleOpenModal = (employee = null) => {
    setSelectedEmployee(
      employee
        ? {
            fname: employee.fname || "",
            lname: employee.lname || "",
            email: employee.email || "",
            role: employee.role || "staff",
            position: employee.position || "",
          }
        : { fname: "", lname: "", email: "", role: "staff", position: "" }
    );
    setEditMode(!!employee);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setError("");
  };

  const handleChange = (e) => {
    setSelectedEmployee({
      ...selectedEmployee,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setError("");

    try {
      if (
        !selectedEmployee.fname ||
        !selectedEmployee.lname ||
        !selectedEmployee.email
      ) {
        setError("⚠️ Please fill in all required fields.");
        setIsLoading(false);
        return;
      }

      if (editMode) {
        await handleUpdateEmployee(selectedEmployee);
      } else {
        await handleCreateEmployee(selectedEmployee);
      }

      handleCloseModal();
      fetchDashboardData();
    } catch (err) {
      setError("❌ Error saving staff member. Try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (employeeId) => {
    if (window.confirm("Are you sure you want to delete this staff member?")) {
      setIsLoading(true);
      try {
        await handleDeleteEmployee(employeeId);
        fetchDashboardData();
      } catch (err) {
        setError("❌ Error deleting staff member.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="employee-container">
      <div className="header">
        <h2>Shelter Staff</h2>
        <div className="search-bar">
          <BsSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search staff..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        {user?.role === "admin" && (
          <Button onClick={() => handleOpenModal()} variant="success">
            + Add Staff Member
          </Button>
        )}
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      <div className="employee-list">
        {isLoading ? (
          <div className="loading-spinner">
            <Spinner animation="border" />
          </div>
        ) : filteredEmployees.length > 0 ? (
          filteredEmployees.map((employee) => (
            <div key={employee._id} className="employee-card">
              <BsPersonBadge className="employee-icon" />
              <div className="employee-info">
                <h4>
                  {employee.fname} {employee.lname}
                </h4>
                <p>{employee.email}</p>
                <span className={`role-badge ${employee.role}`}>
                  {employee.role}
                </span>
                {employee.position && <p>Position: {employee.position}</p>}
              </div>
              {user?.role === "admin" && (
                <div className="employee-actions">
                  <BsThreeDotsVertical
                    className="options-icon"
                    onClick={() => handleOpenModal(employee)}
                  />
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDelete(employee._id)}
                  >
                    Delete
                  </Button>
                </div>
              )}
            </div>
          ))
        ) : (
          <p className="no-results">No staff members found.</p>
        )}
      </div>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>
            {editMode ? "Edit Staff Member" : "Add Staff Member"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form>
            <Form.Group controlId="fname">
              <Form.Label>First Name</Form.Label>
              <Form.Control
                type="text"
                name="fname"
                value={selectedEmployee.fname}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group controlId="lname">
              <Form.Label>Last Name</Form.Label>
              <Form.Control
                type="text"
                name="lname"
                value={selectedEmployee.lname}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group controlId="email">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={selectedEmployee.email}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group controlId="role">
              <Form.Label>Role</Form.Label>
              <Form.Control
                as="select"
                name="role"
                value={selectedEmployee.role}
                onChange={handleChange}
              >
                <option value="staff">Staff</option>
                <option value="admin">Admin</option>
                <option value="volunteer">Volunteer</option>
              </Form.Control>
            </Form.Group>

            <Form.Group controlId="position">
              <Form.Label>Position</Form.Label>
              <Form.Control
                type="text"
                name="position"
                value={selectedEmployee.position}
                onChange={handleChange}
                placeholder="e.g., Adoption Counselor, Veterinarian"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? (
              <Spinner size="sm" animation="border" />
            ) : editMode ? (
              "Update Staff"
            ) : (
              "Add Staff"
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Staff;
