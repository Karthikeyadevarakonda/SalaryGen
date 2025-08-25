import { createContext, useState, useContext,useEffect } from "react";



const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({id:null, token: null, role: null, username: null });



  useEffect(() => {
    const savedAuth = localStorage.getItem("auth");
    if (savedAuth) {
      setAuth(JSON.parse(savedAuth));
    }
  }, []);

   useEffect(() => {
    if (auth.token) {
      localStorage.setItem("auth", JSON.stringify(auth));
    } else {
      localStorage.removeItem("auth");
    }
  }, [auth]);


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

export default AuthProvider;


export const useAuth = () => useContext(AuthContext);