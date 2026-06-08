import axios from "axios";

const API = axios.create({ baseURL: "http://localhost:3000" });

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

export const register = (username, password, email) =>
  API.post("/register", { username, password, email });
export const login = (username, password) =>
  API.post("/login", { username, password });
export const forgotPassword = (email) =>
  API.post("/forgot-password", { email });
export const resetPassword = (token, newPassword) =>
  API.post(`/reset-password/${token}`, { newPassword });

export const fetchRecipes = () => API.get("/recipes");
export const addRecipe = (recipe) => API.post("/recipes", recipe);
export const updateRecipe = (id, recipe) => API.put(`/recipes/${id}`, recipe);
export const deleteRecipe = (id) => API.delete(`/recipes/${id}`);
