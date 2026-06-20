import { NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../services/api";

function Navbar() {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user") || "null")
  );

  const [menuOpen, setMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState(
  JSON.parse(localStorage.getItem("mh_notifications") || "[]")
);

const [showNotification, setShowNotification] = useState(false);

useEffect(() => {
  const updateNotification = () => {
    setNotifications(
  JSON.parse(localStorage.getItem("mh_notifications") || "[]")
);
  };

  checkResultNotification();

  window.addEventListener(
    "mh_notification_updated",
    updateNotification
  );

  return () => {
    window.removeEventListener(
      "mh_notification_updated",
      updateNotification
    );
  };
}, []);

  useEffect(() => {
    const fetchFreshUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const response = await api.get("/football/profile", {
          headers: { Authorization: token }
        });

        const updatedUser = {
          ...user,
          ...response.data.user
        };

        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
      } catch (error) {
        console.error(error);
      }
    };

    fetchFreshUser();
  }, []);
const checkResultNotification = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) return;

    const response = await api.get("/football/my-predictions", {
      headers: { Authorization: token }
    });

    const predictions = response.data.predictions || [];

    const seenResults = JSON.parse(
      localStorage.getItem("mh_seen_results") || "[]"
    );

    const newFinishedPredictions = predictions.filter(pred =>
  pred.status === "finished" &&
  pred.result &&
  !seenResults.includes(Number(pred.match_id))
);

if (newFinishedPredictions.length === 0) return;



    const newNotifications = newFinishedPredictions.map(pred => {
  const isCorrect = pred.prediction === pred.result;

  const isPerfect =
    isCorrect &&
    Number(pred.home_score) === Number(pred.final_home_score) &&
    Number(pred.away_score) === Number(pred.final_away_score);

  const homeClose =
    Math.abs(Number(pred.home_score) - Number(pred.final_home_score)) <= 1;

  const awayClose =
    Math.abs(Number(pred.away_score) - Number(pred.final_away_score)) <= 1;

  const isClose =
    isCorrect && !isPerfect && homeClose && awayClose;

  let resultText = "Wrong prediction";

  if (isPerfect) resultText = "Perfect score";
  else if (isClose) resultText = "Close score";
  else if (isCorrect) resultText = "Correct prediction";

  return {
    matchId: Number(pred.match_id),
    message: `${pred.home_team} ${pred.final_home_score} - ${pred.final_away_score} ${pred.away_team}. Your prediction: ${resultText}.`
  };
});

const existingNotifications = JSON.parse(
  localStorage.getItem("mh_notifications") || "[]"
);

const updatedNotifications = [
  ...existingNotifications,
  ...newNotifications
].filter(
  (item, index, self) =>
    index === self.findIndex(
      n => n.matchId === item.matchId
    )
);

localStorage.setItem(
  "mh_notifications",
  JSON.stringify(updatedNotifications)
);

setNotifications(updatedNotifications);

window.dispatchEvent(new Event("mh_notification_updated"));
  } catch (error) {
    console.error(error);
  }
};

const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  localStorage.removeItem("mh_notifications");
  localStorage.removeItem("mh_seen_results");
  window.location.href = "/";
};

  const linkStyle = ({ isActive }) => ({
    color: isActive ? "#ef4444" : "#d1d5db",
    textDecoration: "none",
    fontWeight: isActive ? "700" : "500",
    fontSize: "16px"
  });

  const links = (
    <>
      <NavLink to="/dashboard" style={linkStyle}>Dashboard</NavLink>
      <NavLink to="/leaderboard" style={linkStyle}>Leaderboard</NavLink>
      <NavLink to="/profile" style={linkStyle}>Profile</NavLink>
      <NavLink to="/my-predictions" style={linkStyle}>Predictions</NavLink>

      {user?.role === "admin" && (
        <NavLink to="/admin" style={linkStyle}>Admin</NavLink>
      )}
    </>
  );

  return (
    <nav style={{
      width: "100%",
      borderBottom: "1px solid #374151",
      background: "#0f172a",
      position: "sticky",
      top: 0,
      zIndex: 1000
    }}>
      <div className="navbar-inner">
        <img src="/redstone-logo.svg" alt="RedStone" className="navbar-logo" />

        <div className="desktop-menu">{links}</div>

        <div className="desktop-user">
 <div style={{ position: "relative" }}>
  <button
    onClick={() => setShowNotification(!showNotification)}
    style={{
      position: "relative",
      background: "rgba(15,23,42,0.9)",
      border: "1px solid #374151",
      color: "white",
      borderRadius: "999px",
      padding: "9px 12px",
      cursor: "pointer",
      fontWeight: "800"
    }}
  >
    🔔

    {notifications.length > 0 && (
      <span
        style={{
          position: "absolute",
          top: "-3px",
          right: "-3px",
          width: "10px",
          height: "10px",
          borderRadius: "50%",
          background: "#ef4444",
          boxShadow: "0 0 12px #ef4444"
        }}
      />
    )}
  </button>

  {showNotification && (
    <div
      style={{
        position: "absolute",
        right: 0,
        top: "45px",
        width: "260px",
        background: "#111827",
        border: "1px solid #374151",
        borderRadius: "14px",
        padding: "14px",
        color: "white",
        zIndex: 9999,
        boxShadow: "0 20px 60px rgba(0,0,0,0.45)"
      }}
    >
      {notifications.length > 0 ? (
        <>
          <div
  style={{
    maxHeight: "260px",
    overflowY: "auto",
    display: "grid",
    gap: "10px",
    marginBottom: "12px"
  }}
>
  {notifications.map(item => (
    <div
      key={item.matchId}
      style={{
        paddingBottom: "10px",
        borderBottom: "1px solid #374151"
      }}
    >
      <strong>{item.message}</strong>

      <p style={{ color: "#9CA3AF", margin: "6px 0 0" }}>
        Leaderboard updated recently
      </p>
    </div>
  ))}
</div>

          <button
onClick={() => {
  const seenResults = JSON.parse(
    localStorage.getItem("mh_seen_results") || "[]"
  );

  const allMatchIds = notifications.map(item => item.matchId);

  localStorage.setItem(
    "mh_seen_results",
    JSON.stringify([
      ...new Set([
        ...seenResults,
        ...allMatchIds
      ])
    ])
  );

  localStorage.removeItem("mh_notifications");

  setNotifications([]);
  setShowNotification(false);
}}
            style={{
              width: "100%",
              padding: "8px",
              borderRadius: "10px",
              border: "1px solid #374151",
              background: "#0f172a",
              color: "#d1d5db",
              cursor: "pointer",
              fontWeight: "700"
            }}
          >
            ✓ Mark all as read
          </button>
        </>
      ) : (
        <p style={{ color: "#9CA3AF", margin: 0 }}>
          No notifications yet
        </p>
      )}
    </div>
  )}
</div>
          <div style={{ textAlign: "right" }}>
            <div style={{ color: "white", fontWeight: "bold" }}>
              👤 {user?.name}
            </div>

            <div style={{ color: "#9CA3AF", fontSize: "13px" }}>
              🏆 {user?.points ?? 0} pts
            </div>
          </div>

          <button onClick={logout} className="logout-btn">
            Logout
          </button>
        </div>

<div className="mobile-nav-actions">
  <div style={{ position: "relative" }}>
    <button
      onClick={() => setShowNotification(!showNotification)}
      className="mobile-notification-btn"
    >
      🔔

      {notifications.length > 0 && (
        <span className="notification-dot" />
      )}
    </button>

    {showNotification && (
      <div className="mobile-notification-box">
        {notifications.length > 0 ? (
          <>
            <div
  style={{
    maxHeight: "260px",
    overflowY: "auto",
    display: "grid",
    gap: "10px",
    marginBottom: "12px"
  }}
>
  {notifications.map(item => (
    <div
      key={item.matchId}
      style={{
        paddingBottom: "10px",
        borderBottom: "1px solid #374151"
      }}
    >
      <strong>{item.message}</strong>

      <p style={{ color: "#9CA3AF", margin: "6px 0 0" }}>
        Leaderboard updated recently
      </p>
    </div>
  ))}
</div>

            <button
onClick={() => {
  const seenResults = JSON.parse(
    localStorage.getItem("mh_seen_results") || "[]"
  );

  const allMatchIds = notifications.map(item => item.matchId);

  localStorage.setItem(
    "mh_seen_results",
    JSON.stringify([
      ...new Set([
        ...seenResults,
        ...allMatchIds
      ])
    ])
  );

  localStorage.removeItem("mh_notifications");

  setNotifications([]);
  setShowNotification(false);
}}
              style={{
                width: "100%",
                padding: "8px",
                borderRadius: "10px",
                border: "1px solid #374151",
                background: "#0f172a",
                color: "#d1d5db",
                cursor: "pointer",
                fontWeight: "700"
              }}
            >
              ✓ Mark all as read
            </button>
          </>
        ) : (
          <p style={{ color: "#9CA3AF", margin: 0 }}>
            No notifications yet
          </p>
        )}
      </div>
    )}
  </div>

  <button
    className="mobile-menu-btn"
    onClick={() => setMenuOpen(!menuOpen)}
  >
    {menuOpen ? "✕" : "☰"}
  </button>
</div>
      </div>

      {menuOpen && (
        <div className="mobile-menu">
          <div className="mobile-links">{links}</div>

          <div className="mobile-user-box">
            <div>👤 <strong>{user?.name}</strong></div>
            <div>🏆 {user?.points ?? 0} pts</div>

            <button onClick={logout} className="logout-btn mobile-logout">
              Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;