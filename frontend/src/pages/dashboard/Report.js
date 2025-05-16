// Report.js (now AdoptionReport.js)
import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { Spinner, Table } from "react-bootstrap";
import { BsFileEarmarkText, BsDownload } from "react-icons/bs";
import useDashboard from "../../hooks/useDashboard";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import "../../styles/Analytics.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const AdoptionReport = () => {
  const {
    state,
    fetchDashboardData,
    fetchProfile,
    fetchReports,
    handleDownload,
  } = useDashboard();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
    fetchProfile();
    fetchReports();
    setLoading(false);
  }, [fetchDashboardData, fetchProfile, fetchReports]);

  const adoptionChartData = {
    labels: ["Dogs", "Cats", "Other Pets"],
    datasets: [
      {
        label: "Adoptions",
        data: [
          state.adoptions?.filter((a) => a.petType === "dog").length || 0,
          state.adoptions?.filter((a) => a.petType === "cat").length || 0,
          state.adoptions?.filter((a) => !["dog", "cat"].includes(a.petType))
            .length || 0,
        ],
        backgroundColor: ["#4CAF50", "#2196F3", "#FFC107"],
      },
    ],
  };

  const chartOptions = {
    scales: {
      y: {
        beginAtZero: true,
        ticks: { stepSize: 1 },
      },
    },
  };

  return (
    <div className="analytic-container">
      <div className="main">
        <div className="main-top">
          <h1>Adoption Analytics</h1>
        </div>

        <h2>Adoption Statistics</h2>
        <div
          className="chart-container"
          style={{ width: "60%", margin: "auto" }}
        >
          {loading ? (
            <Spinner animation="border" role="status">
              <span className="sr-only">Loading...</span>
            </Spinner>
          ) : (
            <Bar data={adoptionChartData} options={chartOptions} />
          )}
        </div>

        {state.profile && (
          <>
            <h2>Staff Information</h2>
            <Table striped bordered hover>
              <tbody>
                <tr>
                  <td>Name</td>
                  <td>{state.profile.name}</td>
                </tr>
                <tr>
                  <td>Email</td>
                  <td>{state.profile.email}</td>
                </tr>
                <tr>
                  <td>Role</td>
                  <td>{state.profile.role}</td>
                </tr>
              </tbody>
            </Table>
          </>
        )}

        <h2>Shelter Settings</h2>
        {state.settings ? (
          <Table striped bordered hover>
            <tbody>
              <tr>
                <td>Adoption Process</td>
                <td>{state.settings.adoptionProcess}</td>
              </tr>
              <tr>
                <td>Notifications</td>
                <td>{state.settings.notifications ? "Enabled" : "Disabled"}</td>
              </tr>
            </tbody>
          </Table>
        ) : (
          <p>No settings available.</p>
        )}

        <h2>Adoption Reports</h2>
        <div className="report-container">
          <div className="report-list">
            {state.reports?.length > 0 ? (
              state.reports.map((report) => (
                <div key={report.id} className="report-card">
                  <BsFileEarmarkText className="report-icon" />
                  <div className="report-info">
                    <h4>{report.title}</h4>
                    <p>{new Date(report.date).toLocaleDateString()}</p>
                    <p>Type: {report.type || "General"}</p>
                  </div>
                  <button
                    onClick={() => handleDownload(report.id)}
                    className="download-btn"
                  >
                    <BsDownload /> Download
                  </button>
                </div>
              ))
            ) : (
              <p>No reports available.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdoptionReport;
