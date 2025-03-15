import { useState, useEffect } from "react";
import { BsPerson, BsSearch, BsThreeDotsVertical } from "react-icons/bs";
import useDashboard from "../../hooks/useDashboard";
import "../../styles/Customer.css";
import { fetchCustomers } from "../../services/dashboardServices";

const Customers = () => {
  const { state, fetchDashboardData } = useDashboard(); // Get customers from context
  const [searchQuery, setSearchQuery] = useState("");

  // ✅ Fetch Customers on Component Mount
useEffect(() => {
  const getCustomers = async () => {
    try {
      const data = await fetchCustomers();
      console.log("👥 Customers Loaded:", data);
    } catch (error) {
      console.error("❌ Error loading customers:", error.message);
    }
  };

  getCustomers();
}, []);

  // ✅ Loading and Error Handling
  if (state.loading) return <p>Loading customers...</p>;
  if (state.error) return <p>Error loading customers: {state.error}</p>;

  // ✅ Ensure customers list exists before filtering
  const filteredCustomers =
    state.customers?.filter((customer) => {
      // ✅ Check if `fname` and `lname` exist before calling `toLowerCase`
      const fullName = `${customer.fname || ""} ${customer.lname || ""}`.trim();
      return fullName.toLowerCase().includes(searchQuery.toLowerCase());
    }) || [];

  return (
    <div className="customers-container">
      <div className="header">
        <h2>Customers</h2>
        <div className="search-bar">
          <BsSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search customers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="customers-list">
        {filteredCustomers.length > 0 ? (
          filteredCustomers.map((customer) => (
            <div key={customer._id} className="customer-card">
              <BsPerson className="customer-icon" />
              <div className="customer-info">
                <h4>
                  {customer.fname} {customer.lname}
                </h4>
                <p>{customer.email}</p>
              </div>
              <BsThreeDotsVertical className="options-icon" />
            </div>
          ))
        ) : (
          <p>No customers found.</p>
        )}
      </div>
    </div>
  );
};

export default Customers;
