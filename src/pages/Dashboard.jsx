import { useEffect, useState } from "react";
import api from "../services/api";
import Navbar from "../components/Navbar";
import ReactCountryFlag from "react-country-flag";


import teamFlags
from "../data/teamFlags";


function Dashboard() {

  const [matches, setMatches] = useState([]);

  const [predictions, setPredictions] =
    useState({});

  const [scores, setScores] =
    useState({});

  useEffect(() => {

    fetchMatches();

  }, []);

  const fetchMatches = async () => {

    try {

      const response =
        await api.get(
          "/football/matches"
        );

      setMatches(
        response.data.matches
      );

    } catch (error) {

      console.log(error);

    }

  };

  const submitPrediction = async (
    matchId
  ) => {

    try {

      const token =
        localStorage.getItem("token");

      const prediction =
        predictions[
          `${matchId}_winner`
        ];

      const homeScore =
        scores[
          `${matchId}_home`
        ];

      const awayScore =
        scores[
          `${matchId}_away`
        ];

      if (!prediction) {

        return alert(
          "Select winner first"
        );

      }

      if (
        homeScore === undefined ||
        awayScore === undefined
      ) {

        return alert(
          "Enter score prediction"
        );

      }

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

      alert(
        "Prediction submitted"
      );

    } catch (error) {

      alert(
        error.response?.data?.message
      );

    }

  };

return (
  <div className="app-shell">
    <Navbar />

    <main className="page-container">
      <section className="page-hero">
        <h1>⚽ RedStone Miners League</h1>
        <h2>FIFA World Cup 2026 Prediction Campaign</h2>
        <p>
          Predict match outcomes, climb the leaderboard, unlock achievements,
          and compete with fellow miners.
        </p>
      </section>

      <div className="match-grid">
        {matches.map(match => {
          const isOpen =
            new Date() < new Date(match.kickoff_time);

          return (
            <div key={match.id} className="match-card">
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
                  📅 {new Date(match.kickoff_time).toLocaleString()}
                </div>

                <div className={`match-status ${isOpen ? "open" : "locked"}`}>
                  {isOpen ? "🟢 Open for predictions" : "🔴 Prediction locked"}
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

              {isOpen ? (
                <div className="predict-box">
                  <h3>Select Winner</h3>

                  <div className="choice-row">
                    <button
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

                    <button
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

                    <button
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
                      className="score-input"
                    />

                    <strong>-</strong>

                    <input
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