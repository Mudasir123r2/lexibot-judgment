// utils/GuestRoute.jsx - Redirects logged-in users away from auth pages
import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function GuestRoute({ children }) {
  const context = useContext(AuthContext);
  const token = localStorage.getItem("token");

  // Safety check if context is not available
  if (!context) {
    // If context is not available, allow access (fallback)
    return children;
  }

  const { user } = context;

  // If user is logged in (has user data and token), redirect to chat
  if (user && token) {
    return <Navigate to="/chat" replace />;
  }

  return children;
}

