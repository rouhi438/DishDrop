import { createContext, useState, useContext, useEffect } from "react";
import { login as loginApi, register as registerApi } from "../services/api";

const AuthContext = createContext();

function decodeToken(token) {
  try {
    const base64 = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(atob(base64));
  } catch {
    return null;
  }
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const username = localStorage.getItem("username");
    const payload = token ? decodeToken(token) : null;
    if (token && username && payload?.id && (!payload.exp || payload.exp * 1000 > Date.now())) {
      setUser({ username, token, id: String(payload.id), isAdmin: Boolean(payload.isAdmin) });
    } else {
      localStorage.removeItem("token");
      localStorage.removeItem("username");
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    const { data } = await loginApi(username, password);
    localStorage.setItem("token", data.token);
    localStorage.setItem("username", data.user);
    const payload = decodeToken(data.token);
    setUser({ username: data.user, token: data.token, id: String(payload.id), isAdmin: Boolean(payload.isAdmin) });
  };

  const register = async (username, password, email) => {
    const { data } = await registerApi(username, password, email);
    localStorage.setItem("token", data.token);
    localStorage.setItem("username", data.user);
    const payload = decodeToken(data.token);
    setUser({ username: data.user, token: data.token, id: String(payload.id), isAdmin: Boolean(payload.isAdmin) });
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
export { decodeToken };
