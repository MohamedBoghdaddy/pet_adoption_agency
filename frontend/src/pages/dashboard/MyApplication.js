// src/pages/dashboard/MyApplication.js
import { useEffect, useState } from "react";
import axios from "axios";
import { Container, Table, Alert, Spinner } from "react-bootstrap";
import { useAuthContext } from "../../context/AuthContext";
import { authHeader } from "../../utils/authHeader";
import "../../styles/MyApplication.css"
const API_URL =
  process.env.REACT_APP_API_URL ??
  (window.location.hostname === "localhost"
    ? "http://localhost:8000"
    : "https://pet-adoption-agency.onrender.com");

const MyApplication = () => {
  const { state } = useAuthContext();
  const user = state.user;
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserApplication = async () => {
      if (!user?._id) return;
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get(
          `${API_URL}/api/adoption/requests/user/${user._id}`,
          authHeader()
        );
        setApplication(res.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch application");
      } finally {
        setLoading(false);
      }
    };

    fetchUserApplication();
  }, [user]);

  if (loading)
    return (
      <Container className="spinner-wrapper">
        <Spinner animation="border" variant="primary" />
      </Container>
    );

  if (error)
    return (
      <Container className="pt-5">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );

  if (!application)
    return (
      <Container className="pt-5">
        <Alert variant="info">
          You have not submitted any adoption application yet.
        </Alert>
      </Container>
    );

  return (
    <Container className="my-application-page">
      <h2>📄 My Adoption Application</h2>
      <Table striped bordered hover className="my-application-table mt-4">
        <tbody>
          <tr>
            <td>Pet Name</td>
            <td>{application.petName}</td>
          </tr>
          <tr>
            <td>Pet Type</td>
            <td>{application.petType}</td>
          </tr>
          <tr>
            <td>Reason</td>
            <td>{application.reason}</td>
          </tr>
          <tr>
            <td>Status</td>
            <td className={`status-${application.status}`}>
              {application.status}
            </td>
          </tr>
          <tr>
            <td>Submitted At</td>
            <td>{new Date(application.createdAt).toLocaleString()}</td>
          </tr>
        </tbody>
      </Table>
    </Container>
  );
};

export default MyApplication;
