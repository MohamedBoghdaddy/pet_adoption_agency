import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "./pages/Home/HomePage";
import Dashboard from "./pages/Dashboard";
import NavBar from "./pages/Home/NavBar";
import Footer from "./pages/Home/footer";
import Signup from "./pages/Loginsystem/Signup";
import Contact from "./pages/Contact/contact"
import Login from "./pages/Loginsystem/Login";
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
        <Route path="/dashboard" element={<Dashboard />} />
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
