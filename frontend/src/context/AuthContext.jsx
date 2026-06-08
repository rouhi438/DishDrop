import { createContext, useState, useContext, useEffect } from "react";
import { login as loginApi, register as registerApi } from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const username = localStorage.getItem("username");
    let isAdmin = false;
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        isAdmin = payload.isAdmin || false;
      } catch (e) {}
    }
    if (token && username) {
      setUser({ username, token, isAdmin });
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    const { data } = await loginApi(username, password);
    localStorage.setItem("token", data.token);
    localStorage.setItem("username", data.user);
    let isAdmin = false;
    try {
      const payload = JSON.parse(atob(data.token.split(".")[1]));
      isAdmin = payload.isAdmin || false;
    } catch (e) {}
    setUser({ username: data.user, token: data.token, isAdmin });
  };

  const register = async (username, password, email) => {
    const { data } = await registerApi(username, password, email);
    localStorage.setItem("token", data.token);
    localStorage.setItem("username", data.user);
    let isAdmin = false;
    try {
      const payload = JSON.parse(atob(data.token.split(".")[1]));
      isAdmin = payload.isAdmin || false;
    } catch (e) {}
    setUser({ username: data.user, token: data.token, isAdmin });
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
