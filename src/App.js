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
        {/* Place the authenticated routes first */}
        {authenticated ? (
          <>
            <Route
              path="/dashboard"
              element={<ProtectedRoute element={<Dashboard />} />}
            />
            <Route path="*" element={<Navigate to="/dashboard" />} />
          </>
        ) : (
          <>
            <Route exact path="/" element={<Login />} />
            <Route exact path="/register" element={<Signup />} />
            <Route path="*" element={<Navigate to="/" />} />
          </>
        )}
      </Routes>
    </Router>
  );
}

export default App;
