import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import Navbar from "../components/Navbar";

function Leaderboard() {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  const currentUser = JSON.parse(
    localStorage.getItem("user") || "null"
  );
  const currentUserIndex = users.findIndex(
  user => Number(user.id) === Number(currentUser?.id)
);

const currentUserRank =
  currentUserIndex >= 0 ? currentUserIndex + 1 : null;

const currentLeaderboardUser =
  currentUserIndex >= 0 ? users[currentUserIndex] : null;

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const response = await api.get("/football/leaderboard");
      setUsers(response.data.users);
    } catch (error) {
      console.error(error);
    }
  };

  const getRankTitle = (points) => {
    if (points >= 100) return "👑 Legend";
    if (points >= 50) return "🔥 Elite";
    if (points >= 25) return "⚡ Pro";
    if (points >= 10) return "⭐ Rising";
    return "🌱 Rookie";
  };

  const getRankIcon = (index) => {
    if (index === 0) return "🥇";
    if (index === 1) return "🥈";
    if (index === 2) return "🥉";
    return `#${index + 1}`;
  };

  return (
    <div className="app-shell">
      <Navbar />

      <main className="page-container">
        <section className="page-hero">
          <h1>🏆 Leaderboard</h1>

        </section>
{currentLeaderboardUser && (
  <div
    className="leaderboard-card"
    style={{
      position: "sticky",
      top: "90px",
      zIndex: 50,
      marginBottom: "25px",
      border: "2px solid #ef4444",
      boxShadow: "0 20px 60px rgba(239,68,68,0.25)"
    }}
  >
    <div className="rank-badge">
      #{currentUserRank}
    </div>

    <div>
      <div
        className="leaderboard-name"
        onClick={() => navigate(`/profile/${currentLeaderboardUser.id}`)}
      >
        {currentLeaderboardUser.name} · You
      </div>

      <div className="leaderboard-rank">
        {getRankTitle(currentLeaderboardUser.points)}
      </div>
    </div>

    <div className="leaderboard-stats">
      <span className="leaderboard-pill">
        ⭐ {currentLeaderboardUser.points} pts
      </span>

      <span className="leaderboard-pill">
        ✅ {currentLeaderboardUser.correct_predictions} correct
      </span>

      <span className="leaderboard-pill">
        🎯 {currentLeaderboardUser.perfect_scores} perfect
      </span>
    </div>
  </div>
)}
        <div className="leaderboard-list">
          {users.map((user, index) => (
            <div
              key={user.id}
              className={`leaderboard-card ${
                index === 0
                  ? "top-1"
                  : index === 1
                  ? "top-2"
                  : index === 2
                  ? "top-3"
                  : ""
              }`}
            >
              <div className="rank-badge">
                {getRankIcon(index)}
              </div>

              <div>
                <div
                  className="leaderboard-name"
                  onClick={() => navigate(`/profile/${user.id}`)}
                >
                  {user.name}
                  {currentUser?.id === user.id && " · You"}
                </div>

                <div className="leaderboard-rank">
                  {getRankTitle(user.points)}
                </div>
              </div>

              <div className="leaderboard-stats">
                <span className="leaderboard-pill">
                  ⭐ {user.points} pts
                </span>

                <span className="leaderboard-pill">
                  ✅ {user.correct_predictions} correct
                </span>

                <span className="leaderboard-pill">
                  🎯 {user.perfect_scores} perfect
                </span>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default Leaderboard;