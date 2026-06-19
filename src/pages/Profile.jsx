import { useEffect, useState } from "react";
import api from "../services/api";
import Navbar from "../components/Navbar";

function Profile() {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({});

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await api.get("/football/profile", {
        headers: {
          Authorization: token
        }
      });

      setUser(response.data.user);
      setStats(response.data.stats);
    } catch (error) {
      console.error(error);
    }
  };

  if (!user) {
    return (
      <div className="app-shell">
        <Navbar />
        <main className="page-container">
          <p>Loading...</p>
        </main>
      </div>
    );
  }

  return (
    <div className="app-shell">
      <Navbar />

      <main className="page-container">
        <section className="profile-card">
          <div className="profile-header">
            <div className="profile-avatar">
              {user.name[0].toUpperCase()}
            </div>

            <div>
              <div className="profile-name">
                {user.name}
              </div>

              <div className="profile-email">
                {user.email}
              </div>

              <div className="profile-points">
                🏆 {user.points} Points
              </div>
            </div>
          </div>
        </section>

<section className="profile-card">
  <h2 className="admin-section-title">
    📊 Statistics
  </h2>

  <p style={{
    color: "#9ca3af",
    marginBottom: "24px",
    textAlign: "center"
  }}>
    Accuracy is calculated from finished matches only.
  </p>

  <div className="profile-stat-grid">
    {[
      {
        title: "Predictions Made",
        value: stats.predictions || 0,
        icon: "🎯",
        color: "#60a5fa",
        bg: "rgba(96,165,250,0.12)"
      },
      {
        title: "Correct",
        value: stats.correct || 0,
        icon: "✅",
        color: "#4ade80",
        bg: "rgba(74,222,128,0.12)"
      },
      {
        title: "Wrong",
        value: stats.wrong || 0,
        icon: "❌",
        color: "#f87171",
        bg: "rgba(248,113,113,0.12)"
      },
      {
        title: "Pending",
        value: stats.pending || 0,
        icon: "⏳",
        color: "#a78bfa",
        bg: "rgba(167,139,250,0.12)"
      },
      {
        title: "Perfect Scores",
        value: stats.perfect || 0,
        icon: "👑",
        color: "#facc15",
        bg: "rgba(250,204,21,0.14)"
      },
      {
        title: "Close Scores",
        value: stats.close || 0,
        icon: "⚡",
        color: "#38bdf8",
        bg: "rgba(56,189,248,0.12)"
      },
      {
        title: "Accuracy",
        value: `${stats.accuracy || 0}%`,
        icon: "📈",
        color: "#fb7185",
        bg: "rgba(251,113,133,0.12)"
      }
    ].map((item, index) => (
      <div
        key={index}
        className="profile-stat"
        style={{
          background: `linear-gradient(135deg, ${item.bg}, #111827)`,
          border: `1px solid ${item.color}`,
          boxShadow: `0 18px 45px ${item.bg}`
        }}
      >
        <h3 style={{ color: "#cbd5e1" }}>
          {item.icon} {item.title}
        </h3>

        <strong style={{ color: item.color }}>
          {item.value}
        </strong>
      </div>
    ))}
  </div>
</section>

        <section className="profile-card">
          <h2 className="admin-section-title">
            🏅 Achievements
          </h2>

          {stats.achievements && stats.achievements.length > 0 ? (
            <div className="achievement-grid">
              {stats.achievements.map((achievement, index) => (
                <div
                  key={index}
                  className="achievement-card"
                >
                  {achievement}
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: "#9ca3af" }}>
              No achievements unlocked yet.
            </p>
          )}
        </section>
      </main>
    </div>
  );
}

export default Profile;