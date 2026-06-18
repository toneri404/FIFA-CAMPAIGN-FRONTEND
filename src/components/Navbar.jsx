import { NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../services/api";

function Navbar() {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user") || "null")
  );

  const [menuOpen, setMenuOpen] = useState(false);
  const [notification, setNotification] = useState(
  JSON.parse(localStorage.getItem("mh_notification") || "null")
);

const [showNotification, setShowNotification] = useState(false);

useEffect(() => {
  const updateNotification = () => {
    setNotification(
      JSON.parse(localStorage.getItem("mh_notification") || "null")
    );
  };

  window.addEventListener("mh_notification_updated", updateNotification);

  return () => {
    window.removeEventListener("mh_notification_updated", updateNotification);
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


const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  localStorage.removeItem("mh_notification");
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

    {notification && (
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
      {notification ? (
        <>
          <strong>{notification.message}</strong>

          <p style={{ color: "#9CA3AF", margin: "6px 0 12px" }}>
            Leaderboard updated recently
          </p>

          <button
            onClick={() => {
              localStorage.removeItem("mh_notification");
              setNotification(null);
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

        <button
          className="mobile-menu-btn"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? "✕" : "☰"}
        </button>
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