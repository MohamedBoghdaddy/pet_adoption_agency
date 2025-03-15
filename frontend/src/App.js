import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "./pages/Home/HomePage";
import Dashboard from "./pages/dashboard/Dashboard";
import NavBar from "./pages/Home/NavBar";
import Footer from "./pages/Home/footer";
import Signup from "./pages/Loginsystem/Signup";
import Contact from "./pages/Contact/contact"
import Login from "./pages/Loginsystem/Login";
import Sidebar from "./pages/dashboard/Sidebar";
import Setting from "./pages/dashboard/Setting";
import Reports from "./pages/dashboard/Report";
import Employees from "./pages/dashboard/Employees";
import Customers from "./pages/dashboard/Customers";


function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <>
              <NavBar />
              <HomePage />
              <Footer />
            </>
          }
        />{" "}
        <Route
          path="/Login"
          element={
            <>
              <NavBar />
              <Login />
              <Footer />
            </>
          }
        />
        <Route
          path="/Signup"
          element={
            <>
              <NavBar />
              <Signup />
              <Footer />
            </>
          }
        />
        <Route
          path="/dashboard"
          element={
            <>
              <NavBar />
              <Sidebar />
              <Dashboard />
              <Footer />
            </>
          }
        />
        <Route
          path="/Setting"
          element={
            <>
              <NavBar />
              <Sidebar />
              <Setting />
              <Footer />
            </>
          }
        />
        <Route
          path="/Reports"
          element={
            <>
              <NavBar />
              <Sidebar />
              <Reports />
              <Footer />
            </>
          }
        />
        <Route
          path="/Profile"
          element={
            <>
              <NavBar />
              <Sidebar />
              <NavBar />
              <Footer />
            </>
          }
        />
        <Route
          path="/Employees"
          element={
            <>
              <NavBar />
              <Sidebar />
              <Employees />
              <Footer />
            </>
          }
        />
        <Route
          path="/Customers"
          element={
            <>
              <NavBar />
              <Sidebar />
              <Customers />
              <Footer />
            </>
          }
        />

        <Route
          path="/contact"
          element={
            <>
              <NavBar />
              <Contact />
              <Footer />
            </>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
