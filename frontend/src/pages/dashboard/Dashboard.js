import { BsCheckCircle, BsHouseDoor, BsPeople } from "react-icons/bs";
import { FaPaw } from "react-icons/fa"; // ✅ Add this line
import useDashboard from "../../hooks/useDashboard";
import "../../styles/dashboard.css";
import Chart from "react-apexcharts";

const Dashboard = () => {
  const { state } = useDashboard();

  const stats = state.analytics || {
    totalPets: 0,
    totalAdoptions: 0,
    totalShelters: 0,
    totalUsers: 0,
    adoptionTrend: [],
    months: [],
  };

  const chartData = {
    series: [{ name: "Adoptions", data: stats.adoptionTrend || [] }],
    options: {
      chart: { type: "line" },
      xaxis: { categories: stats.months || [] },
      title: { text: "Adoption Trend Over Time" },
    },
  };

  return (
    <div className="dashboard-container">
      <h2>Pet Adoption Dashboard</h2>

      <div className="stats-container">
        <div className="stat-card">
          <FaPaw className="stat-icon" />
          <h3>{stats.totalPets}</h3>
          <p>Available Pets</p>
        </div>
        <div className="stat-card">
          <BsCheckCircle className="stat-icon" />
          <h3>{stats.totalAdoptions}</h3>
          <p>Completed Adoptions</p>
        </div>
        <div className="stat-card">
          <BsHouseDoor className="stat-icon" />
          <h3>{stats.totalShelters}</h3>
          <p>Registered Shelters</p>
        </div>
        <div className="stat-card">
          <BsPeople className="stat-icon" />
          <h3>{stats.totalUsers}</h3>
          <p>Total Adopters</p>
        </div>
      </div>

      <div className="chart-container">
        <h3>Monthly Adoption Stats</h3>
        <Chart
          options={chartData.options}
          series={chartData.series}
          type="line"
          height={300}
        />
      </div>
    </div>
  );
};

export default Dashboard;
