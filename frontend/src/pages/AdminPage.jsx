import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "../styles/admin.css";
const API_BASE =
  import.meta.env.VITE_API_URL || "https://dishdrop-8fqc.onrender.com";

export default function AdminPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API_BASE}/admin/stats`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Access denied");
        const data = await res.json();
        console.log("admin stats:", data);
        setStats(data);
      } catch (err) {
        console.error(err);
        alert("You are not authorized to view this page.");
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading)
    return <div className="admin-loading">Loading admin data...</div>;
  if (!stats)
    return <div className="admin-error">No access or error loading data.</div>;

  return (
    <div className="admin-container dark-web">
      <button className="admin-back-btn" onClick={() => navigate(-1)}>
        ← Back
      </button>
      <h1 className="admin-title">Admin Dashboard</h1>
      <div className="global-stats">
        <div className="stat-card">Total Users: {stats.global.totalUsers}</div>
        <div className="stat-card">
          Total Recipes: {stats.global.totalRecipes}
        </div>
        <div className="stat-card">
          Total Ratings: {stats.global.totalRatings}
        </div>
      </div>
      <div className="users-grid">
        {stats.users.map((userStat) => (
          <div key={userStat.userId} className="user-card dotted-box">
            <h3>{userStat.username}</h3>
            <p>
              <strong>Email:</strong> {userStat.email}
            </p>
            <p>
              <strong>Joined:</strong> {userStat.joined}
            </p>
            <p>
              <strong>Recipes created:</strong> {userStat.recipeCount}
            </p>
            <p>
              <strong>Ratings given:</strong> {userStat.ratingsGiven}
            </p>
            <p>
              <strong>Rated recipe IDs:</strong>{" "}
              {userStat.ratedRecipesIds.join(", ") || "None"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
