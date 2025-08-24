import { createContext, useState, useContext } from "react";

import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({id:null, token: null, role: null, username: null });

  const login = (id,token, username, role) => {
    setAuth({id, token, username, role });
  };

  const logout = () => {
    setAuth({ id:null,token: null, username: null, role: null });
  };

  return (
    <AuthContext.Provider value={{ ...auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
