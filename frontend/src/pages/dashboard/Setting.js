import { useState, useEffect, useCallback } from "react";
import { Button, Form, Table } from "react-bootstrap";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useDashboard from "../../hooks/useDashboard";
import { useAuthContext } from "../../context/AuthContext";
import "../../styles/Settings.css";

const Setting = () => {
  const { user } = useAuthContext();
  const {
    state,
    fetchProfile,
    fetchReports,
    handleUpdateProfile,
    fetchDashboardData,
  } = useDashboard();

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
  });

  // Memoized data fetching function
  const fetchAllData = useCallback(async () => {
    await fetchDashboardData();
    await fetchReports();
    if (user?._id) await fetchProfile();
  }, [fetchDashboardData, fetchReports, fetchProfile, user]);

  // 🔄 Load profile and dashboard data
  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  // 🔄 Sync profile state
  useEffect(() => {
    if (state.profile) {
      setProfile({
        name: state.profile.name || "",
        email: state.profile.email || "",
        password: "",
        role: state.profile.role || "",
      });
    }
  }, [state.profile]);

  // ✏️ Input changes
  const handleChange = (e) =>
    setProfile({ ...profile, [e.target.name]: e.target.value });

  // ✅ Submit profile update
  const handleSubmitProfileUpdate = async () => {
    try {
      await handleUpdateProfile(profile);
      toast.success("Profile updated successfully.");
    } catch (error) {
      toast.error("Error updating profile.");
      console.error("Error updating profile:", error);
    }
  };

  return (
    <div className="settings-container">
      <h2>⚙️ Account Settings</h2>

      <h3>👤 Profile Information</h3>
      <Form>
        <Form.Group controlId="name">
          <Form.Label>Full Name</Form.Label>
          <Form.Control
            type="text"
            name="name"
            value={profile.name}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group controlId="email">
          <Form.Label>Email Address</Form.Label>
          <Form.Control
            type="email"
            name="email"
            value={profile.email}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group controlId="password">
          <Form.Label>New Password</Form.Label>
          <Form.Control
            type="password"
            name="password"
            value={profile.password}
            onChange={handleChange}
            placeholder="Leave blank to keep current password"
          />
        </Form.Group>

        <Form.Group controlId="role">
          <Form.Label>User Role</Form.Label>
          <Form.Control
            as="select"
            name="role"
            value={profile.role}
            onChange={handleChange}
          >
            <option value="admin">Admin</option>
            <option value="employee">Employee</option>
            <option value="customer">Customer</option>
          </Form.Control>
        </Form.Group>

        <Button
          variant="primary"
          onClick={handleSubmitProfileUpdate}
          className="mt-3"
        >
          Update Profile
        </Button>
      </Form>

      <h3 className="mt-5">📊 Dashboard Overview</h3>
      <Table striped bordered hover>
        <tbody>
          <tr>
            <td>Total Adoption Requests</td>
            <td>{state.adoptions?.length || 0}</td>
          </tr>
          <tr>
            <td>Registered Users</td>
            <td>{state.customers?.length || 0}</td>
          </tr>
          <tr>
            <td>Team Members</td>
            <td>{state.employees?.length || 0}</td>
          </tr>
        </tbody>
      </Table>
    </div>
  );
};

export default Setting;
