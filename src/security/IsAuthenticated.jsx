import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const IsAuthenticated = () => {
  
 const location = useLocation();

  const {token} = useAuth();
 
  if (!token) return <Navigate to="/login" replace />;

  return <Outlet/>;
}

export default IsAuthenticated
