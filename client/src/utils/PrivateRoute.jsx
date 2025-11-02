import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function PrivateRoute({ children, roles }) {
  const context = useContext(AuthContext);
  
  // Safety check if context is not available
  if (!context) {
    console.error("AuthContext is not available. Make sure AuthProvider wraps the app.");
    return <Navigate to="/login" replace />;
  }

  const { user } = context;

  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/chat" replace />;

  return children;
}
