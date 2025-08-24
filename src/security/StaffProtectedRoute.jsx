import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";


const StaffProtectedRoute = ({children}) => {
  const location = useLocation();
  const {role} = useAuth();


  if (role === "isAdmin" || role == "isHr") {
    return <Navigate to="/unauth" replace state={{ from: location }} />;
  }

  return children;
}

export default StaffProtectedRoute
