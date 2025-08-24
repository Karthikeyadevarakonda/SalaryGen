
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const ProtectedRoutes = ({ children }) => {
  const location = useLocation();
  const {role} = useAuth();
  if (role === "isStaff" || role == "isHr") {
    return <Navigate to="/unauth" replace state={{ from: location }} />;
  }

  return children;
};

export default ProtectedRoutes;
