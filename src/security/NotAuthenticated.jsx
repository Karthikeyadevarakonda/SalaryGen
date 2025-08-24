import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const NotAuthenticated = () => {

  const {token,role} = useAuth();

  if (token) {
    
    switch (role) {
      case "isAdmin":
        return <Navigate to="/adminDashboard" replace />;
      case "isHr":
        return <Navigate to="/hrDashboard" replace />;
      case "isStaff":
        return <Navigate to="/staffDashboard" replace />;
      default:
        return <Navigate to="/welcome" replace />;
    }
  }

  return <Outlet />;
  
};

export default NotAuthenticated;
