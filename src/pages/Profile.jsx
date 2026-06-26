import { useEffect, useState } from "react";
import api from "../services/api";
import Navbar from "../components/Navbar";
import { generateProfileCard } from "../utils/generateProfileCard";

function Profile() {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({});
  const [rank, setRank] = useState(null);
  const [shareLoading, setShareLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
const [imageError, setImageError] = useState("");

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
      const rankResponse = await api.get(`/users/${response.data.user.id}/rank`);
setRank(rankResponse.data.rank);
    } catch (error) {
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






const uploadProfileImage = async (event) => {
  const file = event.target.files[0];

  if (!file) return;

  if (file.size > 300 * 1024) {
    setImageError("Image must be under 300KB");
    return;
  }

  const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

  if (!allowedTypes.includes(file.type)) {
    setImageError("Only JPG, PNG, or WEBP allowed");
    return;
  }

  try {
    setUploading(true);
    setImageError("");

    const token = localStorage.getItem("token");

    const formData = new FormData();
    formData.append("profile_image", file);

    const response = await api.post(
      "/football/profile-image",
      formData,
      {
        headers: {
          Authorization: token,
          "Content-Type": "multipart/form-data"
        }
      }
    );

    const updatedUser = {
      ...user,
      profile_image: response.data.profile_image
    };

    setUser(updatedUser);

    const localUser = JSON.parse(localStorage.getItem("user") || "{}");
    localStorage.setItem(
      "user",
      JSON.stringify({
        ...localUser,
        profile_image: response.data.profile_image
      })
    );
  } catch (error) {
    setImageError(
      error.response?.data?.message || "Failed to upload image"
    );
  } finally {
    setUploading(false);
  }
};


const handleGenerateProfileCard = async () => {
  try {
    setShareLoading(true);

    await generateProfileCard({
      user,
      stats,
      rank,
      totalPlayers: stats.totalPlayers || 50
    });
  } catch (error) {
    console.error(error);
    alert("Failed to generate profile card.");
  } finally {
    setShareLoading(false);
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

  const accuracy = Number(stats.accuracy || 0);

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
    <div className="app-shell">
      <Navbar />

      <main className="page-container">
        <section className="profile-card">
          <div className="profile-header">
<div style={{ textAlign: "center" }}>
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

  <label
    style={{
      display: "inline-block",
      marginTop: "12px",
      background: "#ef4444",
      color: "white",
      padding: "8px 14px",
      borderRadius: "999px",
      cursor: "pointer",
      fontWeight: "900",
      fontSize: "14px"
    }}
  >
    {uploading ? "Uploading..." : "Update Photo"}

    <input
      type="file"
      accept="image/png,image/jpeg,image/webp"
      onChange={uploadProfileImage}
      disabled={uploading}
      style={{ display: "none" }}
    />
  </label>

  {imageError && (
    <p style={{ color: "#f87171", marginTop: "8px", fontSize: "14px" }}>
      {imageError}
    </p>
  )}
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

              <button
  onClick={handleGenerateProfileCard}
  disabled={shareLoading}
  style={{
    marginTop: "14px",
    background: "linear-gradient(135deg, #ef4444, #f97316)",
    color: "white",
    border: "none",
    padding: "11px 18px",
    borderRadius: "999px",
    cursor: "pointer",
    fontWeight: "900"
  }}
>
  {shareLoading ? "Generating..." : "📸 Share Profile Card"}
</button>

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
  color: accuracyColor,
  bg: accuracyBg,
  wide: true
}
    ].map((item, index) => (
      <div
        key={index}
        className="profile-stat"
        style={{
  background: `linear-gradient(135deg, ${item.bg}, #111827)`,
  border: `1px solid ${item.color}`,
  boxShadow: `0 18px 45px ${item.bg}`,
  gridColumn: item.wide ? "span 2" : "auto"
}}
      >
        <h3 style={{ color: "#cbd5e1" }}>
          {item.icon} {item.title}
        </h3>

        <strong style={{ color: item.color }}>
          {item.value}
        </strong>
        {item.title === "Accuracy" && (
  <div
    style={{
      marginTop: "8px",
      fontSize: "13px",
      fontWeight: "800",
      color: item.color
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