import { NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../services/api";

function Navbar() {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user") || "null")
  );

  const [menuOpen, setMenuOpen] = useState(false);

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