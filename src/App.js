import {
  Route,
  BrowserRouter as Router,
  Routes,
  Navigate,
} from "react-router-dom";
import { useEffect, useState } from "react";
import Login from "./pages/loginPage";
import Signup from "./pages/signupPage";
import Dashboard from "./pages/dashboardPage";
import { isAuthenticated } from "./helper/auth";
import Loader from "./components/loader";
import "./styles/dashboard.css";

function App() {
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // checking user exists in local storage or not
  useEffect(() => {
    const checkAuth = () => {
      if (isAuthenticated()) {
        console.log("User exists");
        setAuthenticated(true);
      } else {
        console.log("User does not exist");
        setAuthenticated(false);
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  if (loading) {
    return (
      <div className="loader">
        <Loader />
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route
          exact
          path="/"
          element={authenticated ? <Dashboard /> : <Login />}
        />
        <Route exact path="/register" element={<Signup />} />
        <Route exact path="/dashboard" element={<Dashboard />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
