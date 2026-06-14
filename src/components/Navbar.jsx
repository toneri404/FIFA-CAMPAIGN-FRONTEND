import { NavLink } from "react-router-dom";

function Navbar() {

  const user = JSON.parse(
    localStorage.getItem("user") || "null"
  );

  const logout = () => {

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    window.location.href = "/";

  };

  return (

    <nav
      style={{
        width: "100%",
        borderBottom: "1px solid #374151",
        background: "#0f172a",
        position: "sticky",
        top: 0,
        zIndex: 1000
      }}
    >

      <div
        style={{
          maxWidth: "1300px",
          margin: "0 auto",
          padding: "16px 24px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "15px"
        }}
      >

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px"
          }}
        >
<img
  src="/redstone-logo.svg"
  alt="RedStone"
  style={{
    height: "35px",
    width: "auto",
    display: "block"
  }}
/>


        </div>

        <div
          style={{
            display: "flex",
            gap: "25px",
            alignItems: "center",
            flexWrap: "wrap"
          }}
        >

          <NavLink
            to="/dashboard"
            style={({ isActive }) => ({
              color: isActive ? "#ef4444" : "#d1d5db",
              textDecoration: "none",
              fontWeight: isActive ? "700" : "500"
            })}
          >
            Dashboard
          </NavLink>

          <NavLink
            to="/leaderboard"
            style={({ isActive }) => ({
              color: isActive ? "#ef4444" : "#d1d5db",
              textDecoration: "none",
              fontWeight: isActive ? "700" : "500"
            })}
          >
            Leaderboard
          </NavLink>

          <NavLink
            to="/profile"
            style={({ isActive }) => ({
              color: isActive ? "#ef4444" : "#d1d5db",
              textDecoration: "none",
              fontWeight: isActive ? "700" : "500"
            })}
          >
            Profile
          </NavLink>

          <NavLink
            to="/my-predictions"
            style={({ isActive }) => ({
              color: isActive ? "#ef4444" : "#d1d5db",
              textDecoration: "none",
              fontWeight: isActive ? "700" : "500"
            })}
          >
            Predictions
          </NavLink>

          {
            user?.role === "admin" && (
              <NavLink
                to="/admin"
                style={({ isActive }) => ({
                  color: isActive ? "#ef4444" : "#d1d5db",
                  textDecoration: "none",
                  fontWeight: isActive ? "700" : "500"
                })}
              >
                Admin
              </NavLink>
            )
          }

        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "15px"
          }}
        >

          <div
            style={{
              textAlign: "right"
            }}
          >
            <div
              style={{
                color: "white",
                fontWeight: "bold"
              }}
            >
              👤 {user?.name}
            </div>

            <div
              style={{
                color: "#9CA3AF",
                fontSize: "13px"
              }}
            >
              🏆 {user?.points ?? 0} pts
            </div>
          </div>

          <button
            onClick={logout}
            style={{
              background: "#ef4444",
              color: "white",
              border: "none",
              padding: "10px 16px",
              borderRadius: "10px",
              cursor: "pointer",
              fontWeight: "bold"
            }}
          >
            Logout
          </button>

        </div>

      </div>

    </nav>

  );

}

export default Navbar;