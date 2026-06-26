import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import Navbar from "../components/Navbar";

function Leaderboard() {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  const currentUser = JSON.parse(
    localStorage.getItem("user") || "null"
  );
  const isAdmin = currentUser?.role === "admin";
  const currentUserIndex = users.findIndex(
  user => Number(user.id) === Number(currentUser?.id)
);

const currentUserRank =
  currentUserIndex >= 0 ? currentUserIndex + 1 : null;

const currentLeaderboardUser =
  currentUserIndex >= 0 ? users[currentUserIndex] : null;

const actualUserRef = useRef(null);
const [showStickyUser, setShowStickyUser] = useState(true);
const shouldShowStickyUser =
  !isAdmin &&
  currentLeaderboardUser &&
  currentUserRank > 1 &&
  showStickyUser;

  useEffect(() => {
    fetchLeaderboard();
  }, []);

useEffect(() => {
  const target = actualUserRef.current;

  if (!target) return;

  const observer = new IntersectionObserver(
    ([entry]) => {
      setShowStickyUser(!entry.isIntersecting);
    },
    {
      threshold: 0.4
    }
  );

  observer.observe(target);

  return () => observer.disconnect();
}, [users, currentUserRank]);

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

  const getProfileImageUrl = (image) => {
  if (!image) return null;

  if (image.startsWith("http")) {
    return image;
  }

  return `https://backend.minershub.online/fifa${image}`;
};


const LeaderboardAvatar = ({ user }) => (
  <div
    style={{
      width: "52px",
      height: "52px",
      borderRadius: "16px",
      overflow: "hidden",
      background: "linear-gradient(135deg, #ef4444, #991b1b)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "white",
      fontWeight: "900",
      fontSize: "22px",
      flexShrink: 0
    }}
  >
    {getProfileImageUrl(user.profile_image) ? (
      <img
        src={getProfileImageUrl(user.profile_image)}
        alt={user.name}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover"
        }}
      />
    ) : (
      user.name[0].toUpperCase()
    )}
  </div>
);

  return (
    <div className="app-shell">
      <Navbar />

      <main className="page-container">
        <section className="page-hero">
          <h1>🏆 Leaderboard</h1>

        </section>

{shouldShowStickyUser && (
  <div
    className="leaderboard-card current-user-card"
    style={{
      position: "sticky",
      top: "90px",
      zIndex: 100,
      marginBottom: "18px"
    }}
  >
    <div className="rank-badge">
      #{currentUserRank}
    </div>

    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "14px",
        flex: 1
      }}
    >
      <LeaderboardAvatar user={currentLeaderboardUser} />

      <div>
        <div
          className="leaderboard-name"
          onClick={() =>
            navigate(`/profile/${currentLeaderboardUser.id}`)
          }
        >
          {currentLeaderboardUser.name}

          <span
            style={{
              marginLeft: "10px",
              background: "#22c55e",
              color: "#fff",
              padding: "4px 10px",
              borderRadius: "999px",
              fontSize: "12px",
              fontWeight: "900"
            }}
          >
            YOU
          </span>
        </div>

        <div className="leaderboard-rank">
          {getRankTitle(currentLeaderboardUser.points)}
        </div>
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
  <div key={user.id}>
    <div
      ref={
        Number(currentUser?.id) === Number(user.id)
          ? actualUserRef
          : null
      }
      className={`leaderboard-card ${
        Number(currentUser?.id) === Number(user.id)
          ? "current-user-card"
          : index === 0
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

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "14px",
          flex: 1
        }}
      >
        <LeaderboardAvatar user={user} />

        <div>
          <div
            className="leaderboard-name"
            onClick={() => navigate(`/profile/${user.id}`)}
          >
            {user.name}

            {Number(currentUser?.id) === Number(user.id) && (
              <span
                style={{
                  marginLeft: "10px",
                  background: "#22c55e",
                  color: "#fff",
                  padding: "4px 10px",
                  borderRadius: "999px",
                  fontSize: "12px",
                  fontWeight: "900"
                }}
              >
                YOU
              </span>
            )}
          </div>

          <div className="leaderboard-rank">
            {getRankTitle(user.points)}
          </div>
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
  </div>
))}
        </div>
      </main>
    </div>
  );
}

export default Leaderboard;