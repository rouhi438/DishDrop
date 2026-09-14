import { createContext, useState, useContext, useEffect } from "react";
import { login as loginApi, register as registerApi } from "../services/api";
import { createUserFromSession } from "../utils/auth";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const username = localStorage.getItem("username");
    const restoredUser = createUserFromSession(token, username);
    if (restoredUser) {
      setUser(restoredUser);
    } else {
      localStorage.removeItem("token");
      localStorage.removeItem("username");
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    const { data } = await loginApi(username, password);
    const authenticatedUser = createUserFromSession(data.token, data.user);
    if (!authenticatedUser)
      throw new Error("The server returned an invalid session.");
    localStorage.setItem("token", data.token);
    localStorage.setItem("username", data.user);
    setUser(authenticatedUser);
  };

  const register = async (username, password, email) => {
    const { data } = await registerApi(username, password, email);
    const authenticatedUser = createUserFromSession(data.token, data.user);
    if (!authenticatedUser)
      throw new Error("The server returned an invalid session.");
    localStorage.setItem("token", data.token);
    localStorage.setItem("username", data.user);
    setUser(authenticatedUser);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
