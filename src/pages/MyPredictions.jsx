import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import api from "../services/api";

function MyPredictions() {
  const [predictions, setPredictions] = useState([]);

  useEffect(() => {
    fetchPredictions();
  }, []);

  const fetchPredictions = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await api.get("/football/my-predictions", {
        headers: {
          Authorization: token
        }
      });

      setPredictions(response.data.predictions);
    } catch (error) {
      console.error(error);
    }
  };

const getOutcome = (prediction) => {
  if (!prediction.result || prediction.status !== "finished") {
    return {
      text: "⏳ Pending",
      className: "pending",
      color: "#a855f7",
      bg: "linear-gradient(135deg, rgba(168,85,247,0.14), rgba(15,23,42,0.96))",
      border: "rgba(168,85,247,0.45)"
    };
  }

  const isCorrect = prediction.prediction === prediction.result;

  if (!isCorrect) {
    return {
      text: "❌ Wrong",
      className: "wrong",
      color: "#f87171",
      bg: "linear-gradient(135deg, rgba(239,68,68,0.14), rgba(15,23,42,0.96))",
      border: "rgba(239,68,68,0.45)"
    };
  }

  const isPerfect =
    Number(prediction.home_score) === Number(prediction.final_home_score) &&
    Number(prediction.away_score) === Number(prediction.final_away_score);

  const isClose =
    !isPerfect &&
    Math.abs(Number(prediction.home_score) - Number(prediction.final_home_score)) <= 1 &&
    Math.abs(Number(prediction.away_score) - Number(prediction.final_away_score)) <= 1;

  if (isPerfect) {
    return {
      text: "👑 Perfect Score",
      className: "perfect",
      color: "#facc15",
      bg: "linear-gradient(135deg, rgba(250,204,21,0.20), rgba(15,23,42,0.96))",
      border: "rgba(250,204,21,0.65)"
    };
  }

  if (isClose) {
    return {
      text: "⚡ Close Score",
      className: "close",
      color: "#38bdf8",
      bg: "linear-gradient(135deg, rgba(56,189,248,0.16), rgba(15,23,42,0.96))",
      border: "rgba(56,189,248,0.5)"
    };
  }

  return {
    text: "✅ Correct",
    className: "correct",
    color: "#4ade80",
    bg: "linear-gradient(135deg, rgba(34,197,94,0.14), rgba(15,23,42,0.96))",
    border: "rgba(34,197,94,0.45)"
  };
};

  return (
    <div className="app-shell">
      <Navbar />

      <main className="page-container">
        <section className="page-hero">
          <h1>📌 My Predictions</h1>
          <p>
            Review your submitted predictions, final scores, and match outcomes.
          </p>
        </section>

        <div className="prediction-grid">
          {predictions.map((prediction) => {
            const outcome = getOutcome(prediction);

            return (
              <div
  key={prediction.id}
  className="prediction-card"
  style={{
    background: outcome.bg,
    border: `1px solid ${outcome.border}`,
    borderLeft: `6px solid ${outcome.color}`,
    boxShadow: "0 18px 45px rgba(0,0,0,0.28)"
  }}
>
                <h3>
                  {prediction.home_team} vs {prediction.away_team}
                </h3>

                <p className="prediction-detail">
                  🧠 Prediction: <strong>{prediction.prediction}</strong>
                </p>

                <p className="prediction-detail">
                  🎯 Predicted Score:{" "}
                  <strong>
                    {prediction.home_score} - {prediction.away_score}
                  </strong>
                </p>

                <p className="prediction-detail">
                  📅 Kickoff:{" "}
                  {new Date(prediction.kickoff_time).toLocaleString()}
                </p>

                <p className="prediction-detail">
                  🏁 Final Score:{" "}
                  {prediction.final_home_score !== null
                    ? `${prediction.final_home_score} - ${prediction.final_away_score}`
                    : "Pending"}
                </p>

                <p className="prediction-detail">
                  🏆 Result: {prediction.result || "Pending"}
                </p>

                <p className="prediction-detail">
                  📍 Status: {prediction.status}
                </p>

            <div
  className={`prediction-status ${outcome.className}`}
  style={{
    background: outcome.color,
    color: outcome.className === "perfect" ? "#111827" : "white",
    border: "none"
  }}
>
  {outcome.text}
</div>


              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}

export default MyPredictions;