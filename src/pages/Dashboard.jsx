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
 <div>

    <Navbar />

    <div
      style={{
        maxWidth: "820px",
        margin: "0 auto",
        padding: "20px"
      }}
    >

  <h1
    style={{
      fontSize: "3rem",
      marginBottom: "20px",
      color: "#ffffff"
    }}
  >
    ⚽ RedStone Miners League
  </h1>

<h2
  style={{
    color: "#ef4444",
    marginBottom: "10px",
    paddingLeft: "40px" // 👈 Change this number until it looks perfectly centered
  }}
>
  FIFA World Cup 2026 Prediction Campaign
</h2>

  <p
    style={{
      color: "#9CA3AF",
      maxWidth: "700px",
      margin: "0 auto"
    }}
  >
    Predict match outcomes, climb the leaderboard,
    unlock achievements and compete with fellow miners.
  </p>

</div>

      {
        matches.map(match => (

<div
  key={match.id}
  style={{
    position: "relative",
    overflow: "hidden",
    background: "#111827",
    border: "1px solid #374151",
    borderRadius: "16px",
    padding: "25px",
    marginBottom: "20px",
    boxShadow:
      "0 4px 12px rgba(0,0,0,0.3)"
  }}
>
<div
  style={{
    position: "absolute",
    top: "50%",
    left: "0",
    right: "0",
    transform: "translateY(-50%)",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    opacity: 0.08,
    pointerEvents: "none",
    padding: "0 30px",
    zIndex: 0
  }}
>
  <div
    style={{
      fontSize: "120px"
    }}
  >
    <ReactCountryFlag
      countryCode={
        teamFlags[match.home_team]
      }
      svg
      style={{
        width: "120px",
        height: "120px"
      }}
    />
  </div>

  <div
    style={{
      fontSize: "60px",
      fontWeight: "bold",
      color: "white"
    }}
  >
    VS
  </div>

  <div
    style={{
      fontSize: "120px"
    }}
  >
    <ReactCountryFlag
      countryCode={
        teamFlags[match.away_team]
      }
      svg
      style={{
        width: "120px",
        height: "120px"
      }}
    />
  </div>
</div>

<h2
  style={{
    textAlign: "center",
    marginBottom: "10px",
    position: "relative",
    zIndex: 2
  }}
>

  <ReactCountryFlag
    countryCode={
      teamFlags[match.home_team]
    }
    svg
  />

  {" "}
  {match.home_team}

  {" vs "}

  <ReactCountryFlag
    countryCode={
      teamFlags[match.away_team]
    }
    svg
  />

  {" "}
  {match.away_team}

</h2>

<p
  style={{
    textAlign: "center",
    color: "#9CA3AF",
    marginBottom: "5px"
  }}
>
  📅 {
    new Date(
      match.kickoff_time
    ).toLocaleString()
  }
</p>

<p
  style={{
    textAlign: "center",
    fontWeight: "bold",
    marginBottom: "15px"
  }}
>
  {
    new Date() <
    new Date(
      match.kickoff_time
    )
      ? "🟢 Open"
      : "🔴 Locked"
  }
</p>

            <hr />
            <div
  style={{
    display: "flex",
    justifyContent: "center",
    gap: "20px",
    marginBottom: "15px",
    flexWrap: "wrap",
    color: "#d1d5db",
    fontSize: "14px"
  }}
>
  <span>
    🏆 Winner:
    {" "}
    {match.winner_points ?? 3}
  </span>

  <span>
    🎯 Perfect:
    {" "}
    {match.perfect_points ?? 5}
  </span>

  <span>
    ⚡ Close:
    {" "}
    {match.close_points ?? 1}
  </span>
</div>

<h4
  style={{
    textAlign: "center",
    marginBottom: "15px"
  }}
>
  Select Winner
</h4>

<div
  style={{
    display: "flex",
    justifyContent: "center",
    gap: "10px",
    flexWrap: "wrap",
    marginBottom: "25px"
  }}
>

  <button
    onClick={() =>
      setPredictions({
        ...predictions,
        [`${match.id}_winner`]:
          match.home_team
      })
    }
    style={{
      padding: "10px 16px",
      borderRadius: "10px",
      border:
        predictions[
          `${match.id}_winner`
        ] === match.home_team
          ? "2px solid #22c55e"
          : "1px solid gray",
      background:
        predictions[
          `${match.id}_winner`
        ] === match.home_team
          ? "#22c55e"
          : "#111827",
      color: "white",
      cursor: "pointer"
    }}
  >
    {match.home_team}
  </button>

  <button
    onClick={() =>
      setPredictions({
        ...predictions,
        [`${match.id}_winner`]:
          "Draw"
      })
    }
    style={{
      padding: "10px 16px",
      borderRadius: "10px",
      border:
        predictions[
          `${match.id}_winner`
        ] === "Draw"
          ? "2px solid #f59e0b"
          : "1px solid gray",
      background:
        predictions[
          `${match.id}_winner`
        ] === "Draw"
          ? "#f59e0b"
          : "#111827",
      color: "white",
      cursor: "pointer"
    }}
  >
    Draw
  </button>

  <button
    onClick={() =>
      setPredictions({
        ...predictions,
        [`${match.id}_winner`]:
          match.away_team
      })
    }
    style={{
      padding: "10px 16px",
      borderRadius: "10px",
      border:
        predictions[
          `${match.id}_winner`
        ] === match.away_team
          ? "2px solid #22c55e"
          : "1px solid gray",
      background:
        predictions[
          `${match.id}_winner`
        ] === match.away_team
          ? "#22c55e"
          : "#111827",
      color: "white",
      cursor: "pointer"
    }}
  >
    {match.away_team}
  </button>

</div>

<h4
  style={{
    textAlign: "center",
    marginBottom: "15px"
  }}
>
   Predict Score
</h4>
<div
  style={{
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "20px"
  }}
>

  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: "12px"
    }}
  >

    <input
      type="number"
      placeholder={match.home_team}
      value={
        scores[
          `${match.id}_home`
        ] ?? ""
      }
      onChange={(e) =>
        setScores({
          ...scores,
          [`${match.id}_home`]:
            Number(
              e.target.value
            )
        })
      }
      style={{
        width: "70px",
        height: "45px",
        fontSize: "18px",
        textAlign: "center",
        borderRadius: "12px"
      }}
    />

    <span
      style={{
        fontSize: "22px",
        fontWeight: "bold"
      }}
    >
      -
    </span>

    <input
      type="number"
      placeholder={match.away_team}
      value={
        scores[
          `${match.id}_away`
        ] ?? ""
      }
      onChange={(e) =>
        setScores({
          ...scores,
          [`${match.id}_away`]:
            Number(
              e.target.value
            )
        })
      }
      style={{
        width: "70px",
        height: "45px",
        fontSize: "18px",
        textAlign: "center",
        borderRadius: "12px"
      }}
    />

  </div>

  <button
    style={{
      width: "220px",
      padding: "12px",
      borderRadius: "12px",
      border: "none",
      fontWeight: "bold",
      fontSize: "16px",
      cursor: "pointer",
      background: "#ef4444",
      color: "white"
    }}
    onClick={() =>
      submitPrediction(
        match.id
      )
    }
  >
    Submit Prediction
  </button>

</div>


          </div>

        ))
      }

    </div>
  );

}

export default Dashboard;