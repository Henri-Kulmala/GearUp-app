import { createContext, useContext, useState, useEffect } from "react";
import api from "./ApiConfig";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(null);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    // On app load, check if there's an existing authenticated session
    const init = async () => {
      try {
        const response = await api.get("/api/auth/session");
        setAuth(response.data); // { username: ... }
      } catch {
        setAuth(null);
      }
      setInitialized(true);
    };
    init();
  }, []);

  const login = async (username, password) => {
    // Prepare form data for form login
    const formData = new URLSearchParams();
    formData.append("username", username);
    formData.append("password", password);

    // Perform login with form-encoded data
    await api.post("/api/auth/login", formData, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    // After login, check session again
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
