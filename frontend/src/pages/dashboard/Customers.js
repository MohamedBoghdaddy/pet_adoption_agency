import { useState } from "react";
import { BsPerson, BsSearch, BsThreeDotsVertical } from "react-icons/bs";
import useDashboard from "../../hooks/useDashboard";
import "../../styles/Customer.css";

const Adopters = () => {
  const { state } = useDashboard(); // Removed unused fetchDashboardData
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch adopters through the context state instead of direct API call
  // (assuming your useDashboard hook already handles this)

  if (state.loading) return <p>Loading adopters...</p>;
  if (state.error) return <p>Error loading adopters: {state.error}</p>;

  const filteredAdopters =
    state.adopters?.filter((adopter) => {
      const fullName = `${adopter.fname || ""} ${adopter.lname || ""}`.trim();
      return fullName.toLowerCase().includes(searchQuery.toLowerCase());
    }) || [];

  return (
    <div className="customers-container">
      <div className="header">
        <h2>Adopters</h2>
        <div className="search-bar">
          <BsSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search adopters..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="customers-list">
        {filteredAdopters.length > 0 ? (
          filteredAdopters.map((adopter) => (
            <div key={adopter._id} className="customer-card">
              <BsPerson className="customer-icon" />
              <div className="customer-info">
                <h4>
                  {adopter.fname} {adopter.lname}
                </h4>
                <p>{adopter.email}</p>
                <p>
                  Pets Interested:{" "}
                  {adopter.petsInterested?.join(", ") || "None"}
                </p>
              </div>
              <BsThreeDotsVertical className="options-icon" />
            </div>
          ))
        ) : (
          <p>No adopters found.</p>
        )}
      </div>
    </div>
  );
};

export default Adopters;
