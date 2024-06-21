import React from "react";
import { Navigate } from "react-router-dom";
import { isAuthenticated } from "./auth";

const ProtectedRoute = ({ element: Component }) => {
  return isAuthenticated() ? Component : <Navigate to="/" />;
};

export default ProtectedRoute;
