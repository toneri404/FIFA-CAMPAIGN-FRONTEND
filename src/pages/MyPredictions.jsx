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
    if (!prediction.result) {
      return {
        text: "⏳ Pending",
        className: "pending"
      };
    }

    if (prediction.prediction === prediction.result) {
      return {
        text: "✅ Correct",
        className: "correct"
      };
    }

    return {
      text: "❌ Wrong",
      className: "wrong"
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

                <div className={`prediction-status ${outcome.className}`}>
                  {outcome.text}
                </div>

{
  prediction.result &&
  prediction.prediction === prediction.result &&
  Number(prediction.home_score) === Number(prediction.final_home_score) &&
  Number(prediction.away_score) === Number(prediction.final_away_score) && (
    <div className="prediction-status correct">
      🎯 Perfect Score Prediction
    </div>
  )
}
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}

export default MyPredictions;