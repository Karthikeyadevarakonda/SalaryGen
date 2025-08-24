import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const HrProtectedRoute = ({children}) => {
const location = useLocation();
const {role} = useAuth();

  if (role === "isStaff" || role == "isAdmin") {
    return <Navigate to="/unauth" replace state={{ from: location }} />;
  }

  return children;
}

export default HrProtectedRoute



