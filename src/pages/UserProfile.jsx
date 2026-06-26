import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import api from "../services/api";

function UserProfile() {

  const { id } = useParams();
  const [stats, setStats] =
  useState(null);

const [rank, setRank] =
  useState(null);

  const [user, setUser] =
    useState(null);

  const [predictions, setPredictions] =
    useState([]);



  const fetchUser = async () => {

  try {

    console.log("Fetching user");

    const response =
      await api.get(`/users/${id}`);

    console.log(response.data);

    setUser(response.data.user);

  } catch(error) {

    console.error(error);

  }

};

  const fetchPredictions =
    async () => {

    try {

      const response =
        await api.get(
          `/users/${id}/predictions`
        );

      setPredictions(
        response.data.predictions
      );

    } catch(error) {

      console.error(error);

    }

  };


const fetchStats = async () => {

  try {

    const response =
      await api.get(
        `/users/${id}/stats`
      );

    setStats(
      response.data.stats
    );

  } catch(error) {

    console.error(error);

  }

};

const fetchRank = async () => {

  try {

    const response =
      await api.get(
        `/users/${id}/rank`
      );

    setRank(
      response.data.rank
    );

  } catch(error) {

    console.error(error);

  }

};



const getProfileImageUrl = (image) => {
  if (!image) return null;

  if (image.startsWith("http")) {
    return image;
  }

  return `https://backend.minershub.online/fifa${image}`;
};



  useEffect(() => {

    fetchUser();
    fetchPredictions();
    fetchStats();
    fetchRank();

  }, []);

    if (!user) {

    return (
      <div>
        <Navbar />
        <h2>Loading...</h2>
      </div>
    );

  }

const getPredictionStatus = (pred) => {
  const winnerPoints = pred.winner_points ?? 3;
  const perfectPoints = pred.perfect_points ?? 5;
  const closePoints = pred.close_points ?? 1;
const isDrawPrediction = pred.prediction === "Draw";
const baseWinnerPoints = isDrawPrediction
  ? winnerPoints * 2
  : winnerPoints;


  if (!pred.result || pred.status !== "finished") {
    return {
  label: "Pending",
  badge: "⏳ Pending",
  color: "#a855f7",
  bg: "linear-gradient(135deg, rgba(168,85,247,0.14), rgba(15,23,42,0.96))",
  border: "rgba(168,85,247,0.45)",
  points: 0
};
  }

  const isCorrect = pred.prediction === pred.result;

  if (!isCorrect) {
    return {
      label: "Loss",
      badge: "❌ Wrong",
      color: "#f87171",
      bg: "rgba(239,68,68,0.12)",
      border: "rgba(239,68,68,0.45)",
      points: 0
    };
  }

  const isPerfect =
    Number(pred.home_score) === Number(pred.final_home_score) &&
    Number(pred.away_score) === Number(pred.final_away_score);

  const isClose =
    !isPerfect &&
    Math.abs(Number(pred.home_score) - Number(pred.final_home_score)) <= 1 &&
    Math.abs(Number(pred.away_score) - Number(pred.final_away_score)) <= 1;

  if (isPerfect) {
    return {
      label: "Win",
      badge: "👑 Perfect Score",
      color: "#facc15",
      bg: "linear-gradient(135deg, rgba(250,204,21,0.20), rgba(15,23,42,0.96))",
      border: "rgba(250,204,21,0.65)",
      points: baseWinnerPoints + perfectPoints
    };
  }

  if (isClose) {
    return {
      label: "Win",
      badge: "⚡ Close Score",
      color: "#38bdf8",
      bg: "rgba(56,189,248,0.14)",
      border: "rgba(56,189,248,0.5)",
      points: baseWinnerPoints + closePoints
    };
  }

  return {
    label: "Win",
    badge: "✅ Correct",
    color: "#4ade80",
    bg: "rgba(34,197,94,0.12)",
    border: "rgba(34,197,94,0.45)",
    points: baseWinnerPoints
  };
};
const accuracy = Number(stats?.accuracy || 0);

const accuracyColor =
  accuracy >= 80
    ? "#facc15"
    : accuracy >= 75
    ? "#22c55e"
    : accuracy >= 50
    ? "#eab308"
    : accuracy >= 30
    ? "#f97316"
    : "#ef4444";

const accuracyBg =
  accuracy >= 80
    ? "rgba(250,204,21,0.14)"
    : accuracy >= 75
    ? "rgba(34,197,94,0.12)"
    : accuracy >= 50
    ? "rgba(234,179,8,0.12)"
    : accuracy >= 30
    ? "rgba(249,115,22,0.12)"
    : "rgba(239,68,68,0.12)";




return (

    <div>

      <Navbar />

      <div
        style={{
          maxWidth:"1000px",
          margin:"0 auto",
          padding:"30px"
        }}
      >

<section className="profile-card">
  <div className="profile-header">
    <div className="profile-avatar" style={{ overflow: "hidden" }}>
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

    <div>
      <div className="profile-name">
        {user.name}
      </div>

      <div className="profile-points">
        🏆 {user.points} Points
      </div>
    </div>
  </div>
</section>


{stats && (
  <section className="profile-card">
    <h2 className="admin-section-title">📊 Statistics</h2>

    <div className="profile-stat-grid">
      {[
  ["🏆 Points", user.points, "#facc15", "rgba(250,204,21,0.12)"],
  ["🥇 Rank", `#${rank}`, "#60a5fa", "rgba(96,165,250,0.12)"],
  ["🎯 Predictions", stats.total_predictions || 0, "#a78bfa", "rgba(167,139,250,0.12)"],
  ["✅ Correct", stats.correct_predictions || 0, "#4ade80", "rgba(74,222,128,0.12)"],
  ["⚡ Close", stats.close_scores || 0, "#38bdf8", "rgba(56,189,248,0.12)"],
  ["👑 Perfect", stats.perfect_scores || 0, "#facc15", "rgba(250,204,21,0.14)"],
  ["⏳ Pending", stats.pending_predictions || 0, "#a855f7", "rgba(168,85,247,0.12)"],
  ["📈 Accuracy", `${stats.accuracy || 0}%`, accuracyColor, accuracyBg, true]
].map(([title, value, color, bg, wide], index) => (
        <div
          key={index}
          className="profile-stat"
          style={{
            background: `linear-gradient(135deg, ${bg}, #111827)`,
            border: `1px solid ${color}`,
            
          }}
        >
          <h3>{title}</h3>
          <strong style={{ color }}>{value}</strong>
          {title.includes("Accuracy") && (
  <div
    style={{
      marginTop: "8px",
      fontSize: "13px",
      fontWeight: "900",
      color
    }}
  >
    {accuracy >= 80
      ? "👑 Elite"
      : accuracy >= 75
      ? "🔥 Excellent"
      : accuracy >= 50
      ? "⭐ Good"
      : accuracy >= 30
      ? "⚡ Average"
      : "📉 Needs Work"}
  </div>
)}
        </div>
      ))}
    </div>
  </section>
)}

        <p>
          🏆 Points:
          {" "}
          {user.points}
        </p>

        <p>
          🔗
          {" "}
          {user.twitter_url}
        </p>

        <p>
          📅 Joined:
          {" "}
          {
            new Date(
              user.created_at
            ).toLocaleDateString()
          }
        </p>

        <hr />

        <h2>
          Recent Predictions
        </h2>

        {
          predictions.map(pred => {
  const status = getPredictionStatus(pred);


  return (
    <div
      key={pred.id}
      style={{
        background: status.bg,
        border: `1px solid ${status.border}`,
        borderLeft: `6px solid ${status.color}`,
        borderRadius: "16px",
        padding: "20px",
        marginBottom: "16px",
        boxShadow: "0 12px 35px rgba(0,0,0,0.18)"
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "16px",
          flexWrap: "wrap",
          marginBottom: "16px"
        }}
      >
        <h3
          style={{
            margin: 0,
            textAlign: "left",
            flex: 1
          }}
        >
          {pred.home_team} vs {pred.away_team}
        </h3>

        <span
          style={{
            background: status.color,
            color: status.badge.includes("Perfect") ? "#111827" : "white",
            padding: "8px 14px",
            borderRadius: "999px",
            fontWeight: "900",
            whiteSpace: "nowrap"
          }}
        >
          {status.badge}
        </span>
      </div>

      <div style={{ textAlign: "left", lineHeight: "1.8" }}>
        <p>
          Prediction: <strong>{pred.prediction}</strong>
        </p>

        <p>
          Predicted Score:{" "}
          <strong>{pred.home_score} - {pred.away_score}</strong>
        </p>

        <p>
          Final Score:{" "}
          <strong>
            {pred.final_home_score !== null && pred.final_away_score !== null
              ? `${pred.final_home_score} - ${pred.final_away_score}`
              : "Pending"}
          </strong>
        </p>

        <p style={{ color: status.color, fontWeight: "900" }}>
          {status.label === "Win"
            ? "🏆 Result: Win"
            : status.label === "Loss"
            ? "❌ Result: Loss"
            : "⏳ Result: Pending"}
        </p>

        <p style={{ fontWeight: "900", color: "#facc15" }}>
          +{status.points} pts earned
        </p>
      </div>
    </div>
  );
})
        }

      </div>

    </div>

  );

}

export default UserProfile;