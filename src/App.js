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
import ProtectedRoute from "./helper/protectedRoute";
import { isAuthenticated } from "./helper/auth";

function App() {
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      if (isAuthenticated()) {
        console.log("User exists");
        setAuthenticated(true);
      } else {
        console.log("User does not exist");
        setAuthenticated(false);
      }
    };

    checkAuth();
  }, []);

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
