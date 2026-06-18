import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import api from "../services/api";
import Toast from "../components/Toast";
import ReactCountryFlag from "react-country-flag";
import teamFlags from "../data/teamFlags";

function Admin() {
  const [users, setUsers] = useState([]);
  const [userFilter, setUserFilter] = useState("pending");

  const [homeTeam, setHomeTeam] = useState("");
  const [awayTeam, setAwayTeam] = useState("");
  const [kickoffTime, setKickoffTime] = useState("");

  const [winnerPoints, setWinnerPoints] = useState("");
  const [perfectPoints, setPerfectPoints] = useState("");
  const [closePoints, setClosePoints] = useState("");

  const [matches, setMatches] = useState([]);
  const [stats, setStats] = useState(null);
  const [resultScores, setResultScores] = useState({});
  const [matchPredictions, setMatchPredictions] = useState({});
  const [openedMatch, setOpenedMatch] = useState(null);

  const [toast, setToast] = useState(null);
  const [editingMatch, setEditingMatch] = useState(null);
  const [editData, setEditData] = useState({});

  const [allUsers, setAllUsers] = useState([]);
  const [profileData, setProfileData] = useState(null);
  const [profilePredictions, setProfilePredictions] = useState([]);
  const [showProfile, setShowProfile] = useState(false);

  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [matchFilter, setMatchFilter] = useState("upcoming");

  const showToast = (message, type = "success") => {
    setToast({ message, type });

    setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  useEffect(() => {
    fetchUsers();
    fetchMatches();
    fetchStats();
    fetchAllUsers();
  }, []);

  const cardStyle = {
    background: "#111827",
    border: "1px solid #374151",
    borderRadius: "16px",
    padding: "20px",
    marginBottom: "20px"
  };

  const statBox = {
    background: "#0f172a",
    padding: "20px",
    borderRadius: "12px",
    textAlign: "center",
    border: "1px solid #374151"
  };

  const inputStyle = {
    background: "#0f172a",
    border: "1px solid #374151",
    borderRadius: "10px",
    padding: "12px",
    color: "white",
    fontSize: "15px"
  };

  const smallInputStyle = {
    width: "90px",
    height: "50px",
    textAlign: "center",
    fontSize: "18px",
    borderRadius: "12px",
    border: "1px solid #374151",
    background: "#0f172a",
    color: "white"
  };

  
const utcInputToDb = (value) => {
  return value.replace("T", " ") + ":00";
};

const utcDbToInput = (value) => {
  return value.replace(" ", "T").slice(0, 16);
};

const formatUtcTime = (value) => {
  const date = new Date(value.replace(" ", "T") + "Z");

  return date.toLocaleString("en-US", {
    timeZone: "UTC",
    dateStyle: "medium",
    timeStyle: "short"
  }) + " UTC";
};



 



  const TeamFlag = ({ team }) => {
    const code = teamFlags[team?.trim()];

    if (!code) return null;

    return (
      <ReactCountryFlag
        countryCode={code}
        svg
        style={{
          width: "1.4em",
          height: "1.4em",
          marginRight: "6px"
        }}
      />
    );
  };

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await api.get("/admin/pending-users", {
        headers: {
          Authorization: token
        }
      });

      setUsers(response.data.users);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchMatches = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await api.get("/admin/matches", {
        headers: {
          Authorization: token
        }
      });

      setMatches(response.data.matches);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchAllUsers = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await api.get("/admin/users", {
        headers: {
          Authorization: token
        }
      });

      setAllUsers(response.data.users);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await api.get("/admin/stats", {
        headers: {
          Authorization: token
        }
      });

      setStats(response.data.stats);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchUserProfile = async (userId) => {
    try {
      const token = localStorage.getItem("token");

      const response = await api.get(`/admin/user-profile/${userId}`, {
        headers: {
          Authorization: token
        }
      });

      setProfileData(response.data.user);
      setProfilePredictions(response.data.predictions);
    } catch (error) {
      console.error(error);
    }
  };

  const approveUser = async (id) => {
    try {
      const token = localStorage.getItem("token");

      await api.post(`/admin/approve-user/${id}`, {}, {
        headers: {
          Authorization: token
        }
      });

      showToast("User approved successfully", "success");

      fetchUsers();
      fetchAllUsers();
      fetchStats();
    } catch (error) {
      showToast(
        error.response?.data?.message || "Failed to approve user",
        "error"
      );
    }
  };

  const rejectUser = async (id) => {
    try {
      const token = localStorage.getItem("token");

      await api.post(`/admin/reject-user/${id}`, {}, {
        headers: {
          Authorization: token
        }
      });

      showToast("User rejected. Points are preserved.", "success");

      fetchUsers();
      fetchAllUsers();
      fetchStats();
    } catch (error) {
      showToast(
        error.response?.data?.message || "Failed to reject user",
        "error"
      );
    }
  };

  const createMatch = async () => {
    if (!homeTeam.trim()) {
      showToast("Home team is required", "error");
      return;
    }

    if (!awayTeam.trim()) {
      showToast("Away team is required", "error");
      return;
    }

    if (!kickoffTime) {
      showToast("Kickoff date and time is required", "error");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      await api.post(
        "/admin/matches",
        {
          home_team: homeTeam.trim(),
          away_team: awayTeam.trim(),
          kickoff_time: utcInputToDb(kickoffTime),
          winner_points: winnerPoints === "" ? null : Number(winnerPoints),
          perfect_points: perfectPoints === "" ? null : Number(perfectPoints),
          close_points: closePoints === "" ? null : Number(closePoints)
        },
        {
          headers: {
            Authorization: token
          }
        }
      );

      showToast("Match created successfully", "success");

      setHomeTeam("");
      setAwayTeam("");
      setKickoffTime("");
      setWinnerPoints("");
      setPerfectPoints("");
      setClosePoints("");

      fetchMatches();
      fetchStats();
    } catch (error) {
      showToast(
        error.response?.data?.message || "Failed to create match",
        "error"
      );
    }
  };

  const requestDeleteMatch = (id) => {
    setConfirmDeleteId(id);
  };

  const confirmDeleteMatch = async () => {
    if (!confirmDeleteId) return;

    try {
      const token = localStorage.getItem("token");

      await api.delete(`/admin/matches/${confirmDeleteId}`, {
        headers: {
          Authorization: token
        }
      });

      showToast("Match deleted successfully", "success");

      setConfirmDeleteId(null);
      fetchMatches();
      fetchStats();
      fetchAllUsers();
    } catch (error) {
      showToast(
        error.response?.data?.message || "Failed to delete match",
        "error"
      );
    }
  };

  const saveResult = async (matchId) => {
    const homeScore = resultScores[`${matchId}_home`];
    const awayScore = resultScores[`${matchId}_away`];

    if (
      homeScore === undefined ||
      awayScore === undefined ||
      homeScore === "" ||
      awayScore === ""
    ) {
      showToast("Enter final score", "error");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      await api.post(
        `/admin/match-result/${matchId}`,
        {
          home_score: homeScore,
          away_score: awayScore
        },
        {
          headers: {
            Authorization: token
          }
        }
      );

      showToast("Result saved successfully", "success");

      fetchMatches();
      fetchStats();
      fetchAllUsers();
    } catch (error) {
      showToast(
        error.response?.data?.message || "Failed to save result",
        "error"
      );
    }
  };

  const viewPredictions = async (matchId) => {
    try {
      const token = localStorage.getItem("token");

      const response = await api.get(`/admin/match-predictions/${matchId}`, {
        headers: {
          Authorization: token
        }
      });

      setMatchPredictions({
        ...matchPredictions,
        [matchId]: response.data.predictions
      });

      setOpenedMatch(matchId);
    } catch (error) {
      showToast("Failed to load predictions", "error");
    }
  };

  const updateMatch = async (id) => {
    if (!editData.home_team?.trim()) {
      showToast("Home team is required", "error");
      return;
    }

    if (!editData.away_team?.trim()) {
      showToast("Away team is required", "error");
      return;
    }

    if (!editData.kickoff_time) {
      showToast("Kickoff date and time is required", "error");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      await api.put(
        `/admin/matches/${id}`,
        {
          ...editData,
          home_team: editData.home_team.trim(),
          away_team: editData.away_team.trim(),
          kickoff_time: utcInputToDb(editData.kickoff_time)
        },
        {
          headers: {
            Authorization: token
          }
        }
      );

      showToast("Match updated successfully", "success");

      setEditingMatch(null);

      fetchMatches();
      fetchStats();
    } catch (error) {
      showToast(
        error.response?.data?.message || "Failed to update match",
        "error"
      );
    }
  };

  const getMatchCategory = (match) => {
  const kickoff = new Date(match.kickoff_time.replace(" ", "T") + "Z");
  const now = new Date();

  if (match.status === "finished") {
    return "finished";
  }

  if (now >= kickoff) {
    return "awaiting";
  }

  return "upcoming";
};

const filteredMatches = matches.filter(
  match => getMatchCategory(match) === matchFilter
);

  return (
    <div>
      <Navbar />
      <Toast toast={toast} />

      {confirmDeleteId && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.65)",
            zIndex: 9998,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px"
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: "420px",
              background: "#111827",
              border: "1px solid #ef4444",
              borderRadius: "20px",
              padding: "28px",
              boxShadow: "0 30px 80px rgba(0,0,0,0.55)",
              textAlign: "center"
            }}
          >
            <h2 style={{ color: "white", marginBottom: "10px" }}>
              Delete Match?
            </h2>

            <p style={{ color: "#9ca3af", marginBottom: "24px" }}>
              This will delete the match, all predictions for this match, and
              recalculate all related points.
            </p>

            <div
              style={{
                display: "flex",
                gap: "12px",
                justifyContent: "center",
                flexWrap: "wrap"
              }}
            >
              <button
                onClick={() => setConfirmDeleteId(null)}
                style={{
                  background: "#1f2937",
                  color: "white",
                  border: "1px solid #374151",
                  borderRadius: "10px",
                  padding: "11px 18px",
                  cursor: "pointer",
                  fontWeight: "700"
                }}
              >
                Cancel
              </button>

              <button
                onClick={confirmDeleteMatch}
                style={{
                  background: "#ef4444",
                  color: "white",
                  border: "none",
                  borderRadius: "10px",
                  padding: "11px 18px",
                  cursor: "pointer",
                  fontWeight: "700"
                }}
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="page-container">
        <h1
          style={{
            textAlign: "center",
            marginBottom: "30px"
          }}
        >
          Admin Dashboard
        </h1>

        {stats && (
          <div style={cardStyle}>
            <h2>📊 Platform Overview</h2>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
                gap: "15px"
              }}
            >
              <div style={statBox}>
                <h3>👥 Users</h3>
                <h1>{stats.users}</h1>
              </div>

              <div style={statBox}>
                <h3>⏳ Pending</h3>
                <h1>{stats.pendingUsers}</h1>
              </div>

              <div style={statBox}>
                <h3>⚽ Matches</h3>
                <h1>{stats.matches}</h1>
              </div>

              <div style={statBox}>
                <h3>📅 Scheduled</h3>
                <h1>{stats.scheduledMatches}</h1>
              </div>

              <div style={statBox}>
                <h3>🏁 Finished</h3>
                <h1>{stats.finishedMatches}</h1>
              </div>

              <div style={statBox}>
                <h3>🎯 Predictions</h3>
                <h1>{stats.predictions}</h1>
              </div>

              <div style={statBox}>
                <h3>🏆 Points</h3>
                <h1>{stats.points}</h1>
              </div>
            </div>
          </div>
        )}

        <div style={cardStyle}>
          <h2>👥 User Management</h2>

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "12px",
              marginTop: "20px",
              flexWrap: "wrap"
            }}
          >
            <button
              onClick={() => setUserFilter(userFilter === "approved" ? null : "approved")}
              style={{
                padding: "10px 18px",
                borderRadius: "10px",
                border: "none",
                cursor: "pointer",
                background: userFilter === "approved" ? "#22c55e" : "#1f2937",
                color: "white",
                fontWeight: "bold"
              }}
            >
              Approved
            </button>

            <button
              onClick={() => setUserFilter(userFilter === "pending" ? null : "pending")}
              style={{
                padding: "10px 18px",
                borderRadius: "10px",
                border: "none",
                cursor: "pointer",
                background: userFilter === "pending" ? "#f59e0b" : "#1f2937",
                color: "white",
                fontWeight: "bold"
              }}
            >
              Pending
            </button>

            <button
              onClick={() => setUserFilter(userFilter === "rejected" ? null : "rejected")}
              style={{
                padding: "10px 18px",
                borderRadius: "10px",
                border: "none",
                cursor: "pointer",
                background: userFilter === "rejected" ? "#ef4444" : "#1f2937",
                color: "white",
                fontWeight: "bold"
              }}
            >
              Rejected
            </button>
          </div>

          {!showProfile && userFilter && (
            <div className="admin-user-grid">
              {allUsers
                .filter(user => user.status === userFilter)
                .map(user => (
                  <div
                    key={user.id}
                    className="admin-user-card"
                  >
                    <h3
                      style={{
                        fontSize: "28px",
                        marginBottom: "10px",
                        color: "white"
                      }}
                    >
                      {user.name}
                    </h3>

                    <p style={{ color: "#9CA3AF", margin: "6px 0" }}>
                      {user.email}
                    </p>

                    <p style={{ color: "#60A5FA", margin: "6px 0" }}>
                      {user.twitter_url}
                    </p>

                    <p>🏆 Points: {user.points}</p>

                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        gap: "12px",
                        marginTop: "20px",
                        flexWrap: "wrap"
                      }}
                    >
                      <button
                        onClick={() => {
                          setShowProfile(true);
                          setUserFilter(null);
                          fetchUserProfile(user.id);
                        }}
                        style={{
                          background: "#3b82f6",
                          color: "white",
                          border: "none",
                          borderRadius: "10px",
                          padding: "10px 16px",
                          cursor: "pointer",
                          fontWeight: "600"
                        }}
                      >
                        View Profile
                      </button>

                      {user.status === "pending" && (
                        <>
                          <button
                            onClick={() => approveUser(user.id)}
                            style={{
                              background: "#22c55e",
                              color: "white",
                              border: "none",
                              padding: "10px 15px",
                              borderRadius: "10px",
                              cursor: "pointer",
                              fontWeight: "600"
                            }}
                          >
                            Approve
                          </button>

                          <button
                            onClick={() => rejectUser(user.id)}
                            style={{
                              background: "#ef4444",
                              color: "white",
                              border: "none",
                              padding: "10px 15px",
                              borderRadius: "10px",
                              cursor: "pointer",
                              fontWeight: "600"
                            }}
                          >
                            Reject
                          </button>
                        </>
                      )}

                      {user.status === "approved" && (
                        <button
                          onClick={() => rejectUser(user.id)}
                          style={{
                            background: "#ef4444",
                            color: "white",
                            border: "none",
                            borderRadius: "10px",
                            padding: "10px 16px",
                            cursor: "pointer",
                            fontWeight: "600"
                          }}
                        >
                          Reject
                        </button>
                      )}

                      {user.status === "rejected" && (
                        <button
                          onClick={() => approveUser(user.id)}
                          style={{
                            background: "#22c55e",
                            color: "white",
                            border: "none",
                            borderRadius: "10px",
                            padding: "10px 16px",
                            cursor: "pointer",
                            fontWeight: "600"
                          }}
                        >
                          Re-Approve
                        </button>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          )}

          {showProfile && profileData && (
            <div
              style={{
                marginTop: "20px",
                background: "#0f172a",
                padding: "20px",
                borderRadius: "12px",
                border: "1px solid #374151"
              }}
            >
              <h3>👤 User Profile</h3>

              <p>Name: {profileData.name}</p>
              <p>Email: {profileData.email}</p>
              <p>Twitter: {profileData.twitter_url}</p>
              <p>Status: {profileData.status}</p>
              <p>Points: {profileData.points}</p>
              <p>
                Joined:{" "}
                {new Date(profileData.created_at).toLocaleString()}
              </p>

              <hr />

              <h3>📊 Prediction History</h3>

              {profilePredictions.map(pred => {
                let earned = 0;
                let winnerBonus = 0;
                let perfectBonus = 0;
                let closeBonus = 0;

                if (pred.result && pred.prediction === pred.result) {
                  winnerBonus = pred.winner_points ?? 3;

                  if (
                    Number(pred.home_score) === Number(pred.actual_home_score) &&
                    Number(pred.away_score) === Number(pred.actual_away_score)
                  ) {
                    perfectBonus = pred.perfect_points ?? 5;
                  } else if (
                    Number(pred.home_score) - Number(pred.away_score) ===
                    Number(pred.actual_home_score) - Number(pred.actual_away_score)
                  ) {
                    closeBonus = pred.close_points ?? 1;
                  }
                }

                earned = winnerBonus + perfectBonus + closeBonus;

                return (
                  <div
                    key={pred.id}
                    style={{
                      background: "#111827",
                      padding: "15px",
                      borderRadius: "10px",
                      marginBottom: "10px"
                    }}
                  >
                    <h4>
                      {pred.home_team} vs {pred.away_team}
                    </h4>

                    <p>Prediction: {pred.prediction}</p>
                    <p>
                      Predicted Score: {pred.home_score} - {pred.away_score}
                    </p>
                    <p>
                      Actual Score: {pred.actual_home_score} - {pred.actual_away_score}
                    </p>
                    <p>Result: {pred.result || "Pending"}</p>

                    <div style={{ marginTop: "10px" }}>
                      <p>🏆 Winner Bonus: +{winnerBonus}</p>
                      <p>🎯 Perfect Score: +{perfectBonus}</p>
                      <p>⚡ Close Score: +{closeBonus}</p>

                      <p
                        style={{
                          fontWeight: "bold",
                          color: "#22c55e"
                        }}
                      >
                        ⭐ Total Earned: +{earned}
                      </p>
                    </div>
                  </div>
                );
              })}

              <button
                onClick={() => {
                  setShowProfile(false);
                  setUserFilter("pending");
                }}
                style={{
                  background: "#ef4444",
                  color: "white",
                  border: "none",
                  padding: "10px 15px",
                  borderRadius: "10px",
                  cursor: "pointer",
                  fontWeight: "700"
                }}
              >
                Close
              </button>
            </div>
          )}
        </div>

        <div style={cardStyle}>
          <h2 style={{ marginBottom: "20px" }}>
            ⚽ Create Match
          </h2>

          <div
            style={{
              display: "grid",
              gap: "15px"
            }}
          >
            <input
              type="text"
              placeholder="Home Team"
              value={homeTeam}
              onChange={(e) => setHomeTeam(e.target.value)}
              style={inputStyle}
            />

            <input
              type="text"
              placeholder="Away Team"
              value={awayTeam}
              onChange={(e) => setAwayTeam(e.target.value)}
              style={inputStyle}
            />

            <input
              type="datetime-local"
              value={kickoffTime}
              onChange={(e) => setKickoffTime(e.target.value)}
              style={inputStyle}
            />
            <p style={{ color: "#9CA3AF", margin: 0 }}>
  Enter kickoff time in UTC.
</p>

            <input
              type="number"
              placeholder="Winner Points (optional)"
              value={winnerPoints}
              onChange={(e) => setWinnerPoints(e.target.value)}
              style={inputStyle}
            />

            <input
              type="number"
              placeholder="Perfect Score Points (optional)"
              value={perfectPoints}
              onChange={(e) => setPerfectPoints(e.target.value)}
              style={inputStyle}
            />

            <input
              type="number"
              placeholder="Close Score Points (optional)"
              value={closePoints}
              onChange={(e) => setClosePoints(e.target.value)}
              style={inputStyle}
            />

            <p style={{ color: "#9CA3AF", margin: 0 }}>
              Leave empty to use default scoring: Winner = 3, Perfect = 5, Close = 1
            </p>

            <button
              onClick={createMatch}
              style={{
                background: "#ef4444",
                color: "white",
                border: "none",
                padding: "14px",
                borderRadius: "12px",
                cursor: "pointer",
                fontWeight: "bold",
                fontSize: "16px"
              }}
            >
              Create Match
            </button>
          </div>
        </div>

        <hr />

<h2>All Matches</h2>

<div
  style={{
    display: "flex",
    justifyContent: "center",
    gap: "12px",
    marginBottom: "25px",
    flexWrap: "wrap"
  }}
>
  <button
    onClick={() => setMatchFilter("upcoming")}
    style={{
      padding: "10px 18px",
      borderRadius: "10px",
      border: "none",
      cursor: "pointer",
      background: matchFilter === "upcoming" ? "#3b82f6" : "#1f2937",
      color: "white",
      fontWeight: "bold"
    }}
  >
    Upcoming
  </button>

  <button
    onClick={() => setMatchFilter("awaiting")}
    style={{
      padding: "10px 18px",
      borderRadius: "10px",
      border: "none",
      cursor: "pointer",
      background: matchFilter === "awaiting" ? "#f59e0b" : "#1f2937",
      color: "white",
      fontWeight: "bold"
    }}
  >
    Awaiting Result
  </button>

  <button
    onClick={() => setMatchFilter("finished")}
    style={{
      padding: "10px 18px",
      borderRadius: "10px",
      border: "none",
      cursor: "pointer",
      background: matchFilter === "finished" ? "#22c55e" : "#1f2937",
      color: "white",
      fontWeight: "bold"
    }}
  >
    Finished
  </button>
</div>

{filteredMatches.map(match => {
          const time = formatUtcTime(match.kickoff_time);

          return (
            <div
              key={match.id}
              style={cardStyle}
            >
              <h2 style={{ marginBottom: "15px" }}>
                <TeamFlag team={match.home_team} />
                {match.home_team}
                {" vs "}
                <TeamFlag team={match.away_team} />
                {match.away_team}
              </h2>

              <p>
                🌍 UTC time: {time}
              </p>

              <div style={{ marginBottom: "15px", marginTop: "10px" }}>
                <span
                  style={{
                    background:
                      match.status === "finished"
                        ? "#22c55e"
                        : match.status === "live"
                        ? "#ef4444"
                        : "#3b82f6",
                    padding: "5px 10px",
                    borderRadius: "100px",
                    color: "white",
                    fontWeight: "bold"
                  }}
                >
                  {match.status.toUpperCase()}
                </span>
              </div>

              <p>🏆 Winner: {match.winner_points ?? 3}</p>
              <p>🎯 Perfect: {match.perfect_points ?? 5}</p>
              <p>⚡ Close: {match.close_points ?? 1}</p>
              <p>Result: {match.result || "Pending"}</p>

              <p>
                Final Score:{" "}
                {match.home_score !== null && match.away_score !== null
                  ? `${match.home_score} - ${match.away_score}`
                  : "Not Set"}
              </p>

              <hr />

              <p>👥 Total Predictions: {match.total_predictions || 0}</p>
              <p>🏠 {match.home_team} Picks: {match.home_votes || 0}</p>
              <p>✈️ {match.away_team} Picks: {match.away_votes || 0}</p>
              <p>🤝 Draw Picks: {match.draw_votes || 0}</p>

              <h4
                style={{
                  textAlign: "center",
                  marginBottom: "15px"
                }}
              >
                Set Final Score
              </h4>

              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: "12px",
                  marginBottom: "20px"
                }}
              >
                <input
                  type="number"
                  min="0"
                  placeholder={match.home_team}
                  value={resultScores[`${match.id}_home`] ?? ""}
                  onChange={(e) =>
                    setResultScores({
                      ...resultScores,
                      [`${match.id}_home`]: e.target.value === "" ? "" : Number(e.target.value)
                    })
                  }
                  style={smallInputStyle}
                />

                <span
                  style={{
                    fontSize: "24px",
                    fontWeight: "bold"
                  }}
                >
                  -
                </span>

                <input
                  type="number"
                  min="0"
                  placeholder={match.away_team}
                  value={resultScores[`${match.id}_away`] ?? ""}
                  onChange={(e) =>
                    setResultScores({
                      ...resultScores,
                      [`${match.id}_away`]: e.target.value === "" ? "" : Number(e.target.value)
                    })
                  }
                  style={smallInputStyle}
                />
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  gap: "10px",
                  flexWrap: "wrap",
                  marginTop: "15px"
                }}
              >
                <button
                  onClick={() => saveResult(match.id)}
                  style={{
                    background: "#22c55e",
                    color: "white",
                    border: "none",
                    borderRadius: "10px",
                    padding: "10px 15px",
                    cursor: "pointer",
                    fontWeight: "bold"
                  }}
                >
                  Save Result
                </button>

                <button
                  onClick={() => {
                    if (openedMatch === match.id) {
                      setOpenedMatch(null);
                    } else {
                      viewPredictions(match.id);
                    }
                  }}
                  style={{
                    background: "#3b82f6",
                    color: "white",
                    border: "none",
                    borderRadius: "10px",
                    padding: "10px 15px",
                    cursor: "pointer",
                    fontWeight: "bold"
                  }}
                >
                  {openedMatch === match.id ? "Hide Predictions" : "View Predictions"}
                </button>

                <button
                  onClick={() => {
                    setEditingMatch(match.id);

                    setEditData({
                      home_team: match.home_team,
                      away_team: match.away_team,
                     kickoff_time: utcDbToInput(match.kickoff_time),
                      status: match.status
                    });
                  }}
                  style={{
                    background: "#f59e0b",
                    color: "white",
                    border: "none",
                    borderRadius: "10px",
                    padding: "10px 15px",
                    cursor: "pointer",
                    fontWeight: "bold"
                  }}
                >
                  Edit
                </button>

                <button
                  onClick={() => requestDeleteMatch(match.id)}
                  style={{
                    background: "#ef4444",
                    color: "white",
                    border: "none",
                    borderRadius: "10px",
                    padding: "10px 15px",
                    cursor: "pointer",
                    fontWeight: "bold"
                  }}
                >
                  Delete
                </button>
              </div>

              {editingMatch === match.id && (
                <div
                  style={{
                    marginTop: "20px",
                    background: "#0f172a",
                    border: "1px solid #374151",
                    borderRadius: "12px",
                    padding: "20px",
                    display: "grid",
                    gap: "12px"
                  }}
                >
                  <h4>Edit Match</h4>

                  <input
                    type="text"
                    value={editData.home_team}
                    onChange={(e) =>
                      setEditData({
                        ...editData,
                        home_team: e.target.value
                      })
                    }
                    style={inputStyle}
                  />

                  <input
                    type="text"
                    value={editData.away_team}
                    onChange={(e) =>
                      setEditData({
                        ...editData,
                        away_team: e.target.value
                      })
                    }
                    style={inputStyle}
                  />

                  <input
                    type="datetime-local"
                    value={editData.kickoff_time}
                    onChange={(e) =>
                      setEditData({
                        ...editData,
                        kickoff_time: e.target.value
                      })
                    }
                    style={inputStyle}
                  />

                  <select
                    value={editData.status}
                    onChange={(e) =>
                      setEditData({
                        ...editData,
                        status: e.target.value
                      })
                    }
                    style={inputStyle}
                  >
                    <option value="scheduled">Scheduled</option>
                    <option value="live">Live</option>
                    <option value="finished">Finished</option>
                  </select>

                  <div>
                    <button
                      onClick={() => updateMatch(match.id)}
                      style={{
                        background: "#22c55e",
                        color: "white",
                        border: "none",
                        borderRadius: "10px",
                        padding: "10px 15px",
                        cursor: "pointer",
                        fontWeight: "bold"
                      }}
                    >
                      Save Changes
                    </button>

                    <button
                      onClick={() => setEditingMatch(null)}
                      style={{
                        marginLeft: "10px",
                        background: "#374151",
                        color: "white",
                        border: "none",
                        borderRadius: "10px",
                        padding: "10px 15px",
                        cursor: "pointer",
                        fontWeight: "bold"
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {openedMatch === match.id && matchPredictions[match.id] && (
                <div
                  style={{
                    marginTop: "15px",
                    padding: "15px",
                    border: "1px solid #374151",
                    borderRadius: "12px",
                    background: "#0f172a"
                  }}
                >
                  <h4>Predictions</h4>

                  {matchPredictions[match.id].length === 0 ? (
                    <p style={{ color: "#9ca3af" }}>
                      No predictions yet.
                    </p>
                  ) : (
                    matchPredictions[match.id].map(pred => (
                      <div
                        key={pred.id}
                        style={{
                          marginBottom: "8px"
                        }}
                      >
                        <strong>{pred.name}</strong>
                        {" → "}
                        {pred.prediction}
                        {" ("}
                        {pred.home_score}
                        {" - "}
                        {pred.away_score}
                        {")"}
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Admin;