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

          <div className="profile-stat-grid">
            <div className="profile-stat">
              <h3>Predictions Made</h3>
              <strong>{stats.predictions || 0}</strong>
            </div>

            <div className="profile-stat">
              <h3>Correct Predictions</h3>
              <strong>{stats.correct || 0}</strong>
            </div>

            <div className="profile-stat">
              <h3>Wrong Predictions</h3>
              <strong>{stats.wrong || 0}</strong>
            </div>

            <div className="profile-stat">
              <h3>Perfect Scores</h3>
              <strong>{stats.perfect || 0}</strong>
            </div>

            <div className="profile-stat">
              <h3>Close Scores</h3>
              <strong>{stats.close || 0}</strong>
            </div>

            <div className="profile-stat">
              <h3>Accuracy</h3>
              <strong>{stats.accuracy || 0}%</strong>
            </div>
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