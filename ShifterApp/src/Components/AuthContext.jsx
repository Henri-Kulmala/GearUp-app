import { createContext, useContext, useState, useEffect } from "react";
import api from "./ApiConfig";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(null);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {

    const init = async () => {
      try {
        const response = await api.get("/api/auth/session");
        setAuth(response.data); 
      } catch {
        setAuth(null);
      }
      setInitialized(true);
    };
    init();
  }, []);

  const login = async (username, password) => {

    const formData = new URLSearchParams();
    formData.append("username", username);
    formData.append("password", password);


    await api.post("/api/auth/login", formData, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });


    const response = await api.get("/api/auth/session");
    setAuth(response.data);
  };

  const logout = async () => {
    await api.post("/api/auth/logout");
    setAuth(null);
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout, initialized }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
