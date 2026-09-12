import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/admin.css";
const API_BASE =
  import.meta.env.VITE_API_URL || "https://dishdrop-8fqc.onrender.com";

export default function AdminPage() {
  const navigate = useNavigate();
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

  if (loading) {
    return (
      <div className="admin-status" role="status">
        <span className="admin-spinner" aria-hidden="true" />
        <strong>Preparing your dashboard</strong>
        <p>Loading the latest DishDrop activity...</p>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="admin-status admin-error" role="alert">
        <i className="fa-solid fa-circle-exclamation" aria-hidden="true" />
        <strong>Dashboard unavailable</strong>
        <p>You do not have access, or the data could not be loaded.</p>
        <button onClick={() => navigate("/")}>Return home</button>
      </div>
    );
  }

  return (
    <main className="admin-page">
      <div className="admin-shell">
        <header className="admin-hero">
          <div className="admin-topbar">
            <button className="admin-back-btn" onClick={() => navigate(-1)}>
              <i className="fa-solid fa-arrow-left" aria-hidden="true" />
              Back to app
            </button>
            <span className="admin-badge">
              <i className="fa-solid fa-shield-halved" aria-hidden="true" />
              Admin workspace
            </span>
          </div>
          <p className="admin-eyebrow">DishDrop operations</p>
          <h1 className="admin-title">Community overview</h1>
          <p className="admin-intro">
            A clear snapshot of members, recipes, and activity across the platform.
          </p>
        </header>

        <section className="global-stats" aria-label="Platform totals">
          <article className="stat-card">
            <span className="stat-icon stat-icon-users" aria-hidden="true">
              <i className="fa-solid fa-users" />
            </span>
            <div>
              <p>Total users</p>
              <strong>{stats.global.totalUsers}</strong>
              <span>Community members</span>
            </div>
          </article>
          <article className="stat-card">
            <span className="stat-icon stat-icon-recipes" aria-hidden="true">
              <i className="fa-solid fa-book-open" />
            </span>
            <div>
              <p>Total recipes</p>
              <strong>{stats.global.totalRecipes}</strong>
              <span>Published dishes</span>
            </div>
          </article>
          <article className="stat-card">
            <span className="stat-icon stat-icon-ratings" aria-hidden="true">
              <i className="fa-solid fa-star" />
            </span>
            <div>
              <p>Total ratings</p>
              <strong>{stats.global.totalRatings}</strong>
              <span>Community reviews</span>
            </div>
          </article>
        </section>

        <section className="members-section">
          <div className="section-heading">
            <div>
              <p className="admin-eyebrow">Member directory</p>
              <h2>Community members</h2>
            </div>
            <span className="member-count">{stats.users.length} accounts</span>
          </div>

          <div className="users-grid">
            {stats.users.map((userStat) => (
              <article key={userStat.userId} className="user-card">
                <header className="user-card-header">
                  <span className="member-avatar" aria-hidden="true">
                    {userStat.username.charAt(0).toUpperCase()}
                  </span>
                  <div>
                    <h3>{userStat.username}</h3>
                    <p>Joined {userStat.joined}</p>
                  </div>
                </header>
                <a className="member-email" href={`mailto:${userStat.email}`}>
                  <i className="fa-regular fa-envelope" aria-hidden="true" />
                  <span>{userStat.email}</span>
                </a>
                <div className="member-activity">
                  <div>
                    <strong>{userStat.recipeCount}</strong>
                    <span>Recipes</span>
                  </div>
                  <div>
                    <strong>{userStat.ratingsGiven}</strong>
                    <span>Ratings</span>
                  </div>
                </div>
                <details className="rated-recipes">
                  <summary>
                    Rated recipe IDs
                    <i className="fa-solid fa-chevron-down" aria-hidden="true" />
                  </summary>
                  <p>{userStat.ratedRecipesIds?.join(", ") || "No ratings yet"}</p>
                </details>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
