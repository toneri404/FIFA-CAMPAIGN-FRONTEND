import { useEffect, useState, useRef } from "react";
import api from "../services/api";
import Navbar from "../components/Navbar";
import Toast from "../components/Toast";
import ReactCountryFlag from "react-country-flag";
import teamFlags from "../data/teamFlags";

function Dashboard() {
  const [matches, setMatches] = useState([]);
  const [myPredictions, setMyPredictions] = useState([]);
  const [predictions, setPredictions] = useState({});
  const [scores, setScores] = useState({});
  const [toast, setToast] = useState(null);
  const awayInputRefs = useRef({});
  const [now, setNow] = useState(new Date());
  const [openedPredictionMatch, setOpenedPredictionMatch] = useState(null);
const [matchPredictionList, setMatchPredictionList] = useState({});

  const showToast = (message, type = "success") => {
    setToast({ message, type });

    setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  useEffect(() => {

    fetchMatches();
    fetchMyPredictions();
  }, []);
  useEffect(() => {
  const timer = setInterval(() => {
    setNow(new Date());
  }, 1000);

  return () => clearInterval(timer);
}, []);

  const fetchMatches = async () => {
    try {
      const response = await api.get("/football/matches");
      setMatches(response.data.matches);
    } catch (error) {
      showToast("Failed to load matches", "error");
    }
  };

  const fetchMyPredictions = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await api.get(
        "/football/my-predictions",
        {
          headers: {
            Authorization: token
          }
        }
      );

      setMyPredictions(response.data.predictions);
    } catch (error) {
      console.error(error);
    }
  };

  const alreadyPredicted = (matchId) => {
    return myPredictions.some(
      prediction =>
        Number(prediction.match_id) === Number(matchId)
    );
  };

  const getPredictionForMatch = (matchId) => {
    return myPredictions.find(
      prediction =>
        Number(prediction.match_id) === Number(matchId)
    );
  };

  const submitPrediction = async (matchId) => {
    const prediction =
      predictions[`${matchId}_winner`];

    const homeScore =
      scores[`${matchId}_home`];

    const awayScore =
      scores[`${matchId}_away`];

    if (!prediction) {
      showToast("Select winner first", "error");
      return;
    }

    if (
      homeScore === undefined ||
      awayScore === undefined ||
      homeScore === "" ||
      awayScore === ""
    ) {
      showToast("Enter score prediction", "error");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      await api.post(
        "/football/predict",
        {
          match_id: matchId,
          prediction,
          home_score: homeScore,
          away_score: awayScore
        },
        {
          headers: {
            Authorization: token
          }
        }
      );

      showToast("Prediction submitted successfully", "success");

      fetchMatches();
      fetchMyPredictions();

    } catch (error) {
      showToast(
        error.response?.data?.message ||
        "Prediction failed",
        "error"
      );
    }
  };
  const parseUtcDate = (kickoffTime) => {
  const isoTime = kickoffTime
    .replace(" ", "T")
    .replace(/\.\d+$/, "");

  return new Date(`${isoTime}Z`);
};

  const sortedMatches = [...matches].sort((a, b) => {
const aTime = parseUtcDate(a.kickoff_time);
const bTime = parseUtcDate(b.kickoff_time);

  const aOpen = new Date() < aTime;
  const bOpen = new Date() < bTime;

  const aSubmitted = alreadyPredicted(a.id);
  const bSubmitted = alreadyPredicted(b.id);

  const aPriority =
    aOpen && !aSubmitted ? 1 :
    aSubmitted ? 2 :
    3;

  const bPriority =
    bOpen && !bSubmitted ? 1 :
    bSubmitted ? 2 :
    3;

  return aPriority - bPriority || aTime - bTime;
});



const formatMatchTime = (kickoffTime) => {
  const date = parseUtcDate(kickoffTime);

  return date.toLocaleString("en-US", {
    timeZone: "UTC",
    dateStyle: "medium",
    timeStyle: "short"
  }) + " UTC";
};


const getCountdown = (kickoffTime) => {
  const kickoff = parseUtcDate(kickoffTime);
  const diff = kickoff - now;

  if (diff <= 0) {
    return "Started";
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  if (days > 0) {
    return `${days}d ${hours}h ${minutes}m`;
  }

  return `${hours}h ${minutes}m ${seconds}s`;
};

const viewMatchPredictions = async (matchId) => {
  if (openedPredictionMatch === matchId) {
    setOpenedPredictionMatch(null);
    return;
  }

  try {
    const response = await api.get(
      `/football/match-predictions/${matchId}`
    );

    setMatchPredictionList({
      ...matchPredictionList,
      [matchId]: response.data.predictions
    });

    setOpenedPredictionMatch(matchId);
  } catch (error) {
    showToast("Failed to load predictions", "error");
  }
};


  return (
    <div className="app-shell">
      <Navbar />
      <Toast toast={toast} />

      <main className="page-container">
        <section className="page-hero">
          <h1>⚽ RedStone Miners League</h1>
          <h2>World Cup 2026 Prediction Campaign</h2>
          <p>
            Predict match outcomes, climb the leaderboard, unlock achievements,
            and compete with fellow miners.
          </p>
        </section>

        <div className="match-grid">
          {sortedMatches.map(match => {
            const isOpen =
             new Date() < parseUtcDate(match.kickoff_time);
            const time = formatMatchTime(match.kickoff_time);
            const submitted =
              alreadyPredicted(match.id);

            const savedPrediction =
              getPredictionForMatch(match.id);

            const disabled =
              !isOpen || submitted;

            return (
              <div
                key={match.id}
                className={`match-card ${disabled ? "disabled-match-card" : ""}`}
              >
<div className="match-prediction-dropdown">
  
  <button
    onClick={() => viewMatchPredictions(match.id)}
    style={{
      background: openedPredictionMatch === match.id
        ? "linear-gradient(135deg,#ef4444,#f59e0b)"
        : "linear-gradient(135deg,rgba(15,23,42,0.92),rgba(30,41,59,0.92))",
      border: "1px solid rgba(255,255,255,0.22)",
      color: "white",
      borderRadius: "999px",
      padding: "11px 18px",
      cursor: "pointer",
      fontWeight: "900",
      fontSize: "14px",
      backdropFilter: "blur(14px)",
      boxShadow: openedPredictionMatch === match.id
        ? "0 12px 35px rgba(239,68,68,0.35)"
        : "0 10px 28px rgba(0,0,0,0.35)",
      display: "flex",
      alignItems: "center",
      gap: "8px"
    }}
  >
    👀 Predictions
    <span style={{ fontSize: "12px", opacity: 0.85 }}>
      {openedPredictionMatch === match.id ? "▲" : "▼"}
    </span>
  </button>

{openedPredictionMatch === match.id && (

<div className="match-prediction-panel">

<div className="prediction-panel-header">
  <button
    onClick={() => setOpenedPredictionMatch(null)}
    className="prediction-close-btn"
  >
    ✕
  </button>

  <h3>
    👀 Match Predictions
  </h3>
</div>

      {matchPredictionList[match.id]?.length === 0 ? (
        <p style={{ color: "#9CA3AF" }}>
          No predictions yet.
        </p>
      ) : (
        matchPredictionList[match.id]?.map((pred, index) => (
          <div
            key={index}
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: "12px",
              padding: "10px 0",
              borderBottom: "1px solid rgba(255,255,255,0.08)",
              color: "white",
              fontSize: "14px"
            }}
          >
            <strong>{pred.name}</strong>

            <span style={{ textAlign: "right" }}>
              {pred.prediction} ({pred.home_score} - {pred.away_score})
            </span>
          </div>
        ))
      )}
    </div>
  )}
</div>

 <div className="match-countdown-badge">

  ⏳ {getCountdown(match.kickoff_time)}


</div>
                <div className="match-flags-bg">
                  <ReactCountryFlag
                    countryCode={teamFlags[match.home_team]}
                    svg
                    style={{ width: "150px", height: "150px" }}
                  />

                  <div
                    style={{
                      fontSize: "72px",
                      fontWeight: "900",
                      color: "white"
                    }}
                  >
                    VS
                  </div>

                  <ReactCountryFlag
                    countryCode={teamFlags[match.away_team]}
                    svg
                    style={{ width: "150px", height: "150px" }}
                  />
                </div>

                <div className="match-header">
                  <div className="match-title">
                    <ReactCountryFlag
                      countryCode={teamFlags[match.home_team]}
                      svg
                    />
                    {" "}
                    {match.home_team}
                    {" vs "}
                    <ReactCountryFlag
                      countryCode={teamFlags[match.away_team]}
                      svg
                    />
                    {" "}
                    {match.away_team}
                  </div>

                  <div className="match-meta">
                   📅 UTC time: {time}
                  </div>

                  <div
                    className={`match-status ${
                      submitted ? "submitted" : isOpen ? "open" : "locked"
                    }`}
                  >
                    {
                      submitted
                        ? "✅ Prediction submitted"
                        : isOpen
                        ? "🟢 Open for predictions"
                        : "🔴 Prediction locked"
                    }
                  </div>
                </div>

                <div className="reward-row">
                  <span className="reward-pill">
                    🏆 Winner: {match.winner_points ?? 3}
                  </span>
                  <span className="reward-pill">
                    🎯 Perfect: {match.perfect_points ?? 5}
                  </span>
                  <span className="reward-pill">
                    ⚡ Close: {match.close_points ?? 1}
                  </span>
                </div>

                {submitted ? (
                  <div className="locked-note submitted-note">
                    You already submitted:{" "}
                    <strong>{savedPrediction?.prediction}</strong>
                    {" "}
                    ({savedPrediction?.home_score} - {savedPrediction?.away_score})
                  </div>
                ) : isOpen ? (
                  <div className="predict-box">
                    <h3>Select Winner</h3>

                    <div className="choice-row">
                      <button
                        disabled={disabled}
                        onClick={() =>
                          setPredictions({
                            ...predictions,
                            [`${match.id}_winner`]: match.home_team
                          })
                        }
                        className={
                          predictions[`${match.id}_winner`] === match.home_team
                            ? "choice-btn active"
                            : "choice-btn"
                        }
                      >
                        {match.home_team}
                      </button>



<div style={{ position: "relative" }}>
  <button
    disabled={disabled}
    onClick={() =>
      setPredictions({
        ...predictions,
        [`${match.id}_winner`]: "Draw"
      })
    }
    className={
      predictions[`${match.id}_winner`] === "Draw"
        ? "choice-btn draw-active"
        : "choice-btn"
    }
  >
    Draw
  </button>

  <span className="draw-x2-badge">
    🔥 2X
  </span>
</div>


                      <button
                        disabled={disabled}
                        onClick={() =>
                          setPredictions({
                            ...predictions,
                            [`${match.id}_winner`]: match.away_team
                          })
                        }
                        className={
                          predictions[`${match.id}_winner`] === match.away_team
                            ? "choice-btn active"
                            : "choice-btn"
                        }
                      >
                        {match.away_team}
                      </button>
                    </div>

                    <h3>Predict Score</h3>

                    <div className="score-row">
<input
  disabled={disabled}
  type="number"
  min="0"
  placeholder={match.home_team}
  value={scores[`${match.id}_home`] ?? ""}
  onChange={(e) =>
    setScores({
      ...scores,
      [`${match.id}_home`]: Number(e.target.value)
    })
  }
  onKeyDown={(e) => {
    if (e.key === "Enter") {
      awayInputRefs.current[match.id]?.focus();
    }
  }}
  className="score-input"
/>

                      <strong>-</strong>

<input
  ref={(el) => {
    awayInputRefs.current[match.id] = el;
  }}
  disabled={disabled}
  type="number"
  min="0"
  placeholder={match.away_team}
  value={scores[`${match.id}_away`] ?? ""}
                        onChange={(e) =>
                          setScores({
                            ...scores,
                            [`${match.id}_away`]: Number(e.target.value)
                          })
                        }
                        className="score-input"
                      />
                    </div>

                    <button
                      disabled={disabled}
                      className="submit-btn"
                      onClick={() => submitPrediction(match.id)}
                    >
                      Submit Prediction
                    </button>
                  </div>
                ) : (
                  <div className="locked-note">
                    This match has already started. Predictions are closed.
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}

export default Dashboard;