import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { Layout } from "./components/layout/Layout";
import LoginPage from "./pages/LoginPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import HomePage from "./pages/HomePage";
import RecipesPage from "./pages/RecipesPage";
import AddEditRecipePage from "./pages/AddEditRecipePage";
import AdminPage from "./pages/AdminPage";

function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        Loading...
      </div>
    );
  }
  return user ? children : <Navigate to="/login" />;
}

function AdminRoute({ children }) {
  const { user } = useAuth();
  const isAdmin = user?.isAdmin || false;
  if (!user) return <Navigate to="/login" />;
  return isAdmin ? children : <Navigate to="/" />;
}

function AppRoutes() {
  return (
    <Routes>
      {/* صفحات عمومی (بدون نیاز به لاگین) */}
      <Route
        path="/"
        element={
          <Layout>
            <HomePage />
          </Layout>
        }
      />
      <Route
        path="/recipes"
        element={
          <Layout>
            <RecipesPage />
          </Layout>
        }
      />

      {/* صفحات لاگین و بازیابی رمز (بدون Layout) */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password/:token" element={<ResetPasswordPage />} />

      {/* صفحات خصوصی (نیاز به لاگین) */}
      <Route
        path="/add-recipe"
        element={
          <PrivateRoute>
            <Layout>
              <AddEditRecipePage />
            </Layout>
          </PrivateRoute>
        }
      />
      <Route
        path="/edit-recipe/:id"
        element={
          <PrivateRoute>
            <Layout>
              <AddEditRecipePage />
            </Layout>
          </PrivateRoute>
        }
      />
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminPage />
          </AdminRoute>
        }
      />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
