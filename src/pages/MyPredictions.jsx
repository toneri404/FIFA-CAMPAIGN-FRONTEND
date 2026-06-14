import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import api from "../services/api";

function MyPredictions() {

  const [predictions, setPredictions] =
    useState([]);

  useEffect(() => {
    fetchPredictions();
  }, []);

  const fetchPredictions = async () => {

    try {

      const token =
        localStorage.getItem("token");

      const response =
        await api.get(
          "/football/my-predictions",
          {
            headers: {
              Authorization: token
            }
          }
        );

      setPredictions(
        response.data.predictions
      );

    } catch (error) {

      console.error(error);

    }

  };

  return (
    <div>

      <Navbar />

      <h1>My Predictions</h1>

      {
        predictions.map(prediction => (

          <div
            key={prediction.id}
            style={{
              border: "1px solid gray",
              padding: "15px",
              marginBottom: "15px"
            }}
          >

            <h3>
              {prediction.home_team}
              {" vs "}
              {prediction.away_team}
            </h3>

            <p>
              My Prediction:
              {" "}
              {prediction.prediction}
            </p>

            <p>
              Predicted Score:
              {" "}
              {prediction.home_score}
              {" - "}
              {prediction.away_score}
            </p>

            <p>
              Kickoff:
              {" "}
              {new Date(
                prediction.kickoff_time
              ).toLocaleString()}
            </p>

            <p>
              Final Score:
              {" "}
              {
                prediction.final_home_score !== null
                  ? `${prediction.final_home_score} - ${prediction.final_away_score}`
                  : "Pending"
              }
            </p>

            <p>
              Result:
              {" "}
              {prediction.result || "Pending"}
            </p>

            <p>
              Status:
              {" "}
              {prediction.status}
            </p>

            <p>
              Outcome:
              {" "}
              {
                prediction.result
                  ? prediction.prediction === prediction.result
                    ? "✅ Correct"
                    : "❌ Wrong"
                  : "⏳ Pending"
              }
            </p>

            {
              prediction.result &&
              prediction.home_score === prediction.final_home_score &&
              prediction.away_score === prediction.final_away_score &&
              (
                <p>
                  🎯 Perfect Score Prediction
                </p>
              )
            }

            {
              prediction.result &&
              prediction.prediction === prediction.result &&
              !(
                prediction.home_score === prediction.final_home_score &&
                prediction.away_score === prediction.final_away_score
              ) &&
              (
                <p>
                  🔥 Close Score Prediction
                </p>
              )
            }

          </div>

        ))
      }

    </div>
  );

}

export default MyPredictions;