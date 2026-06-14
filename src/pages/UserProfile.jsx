import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import api from "../services/api";

function UserProfile() {

  const { id } = useParams();
  const [stats, setStats] =
  useState(null);

const [rank, setRank] =
  useState(null);

  const [user, setUser] =
    useState(null);

  const [predictions, setPredictions] =
    useState([]);



  const fetchUser = async () => {

  try {

    console.log("Fetching user");

    const response =
      await api.get(`/users/${id}`);

    console.log(response.data);

    setUser(response.data.user);

  } catch(error) {

    console.error(error);

  }

};

  const fetchPredictions =
    async () => {

    try {

      const response =
        await api.get(
          `/users/${id}/predictions`
        );

      setPredictions(
        response.data.predictions
      );

    } catch(error) {

      console.error(error);

    }

  };


const fetchStats = async () => {

  try {

    const response =
      await api.get(
        `/users/${id}/stats`
      );

    setStats(
      response.data.stats
    );

  } catch(error) {

    console.error(error);

  }

};

const fetchRank = async () => {

  try {

    const response =
      await api.get(
        `/users/${id}/rank`
      );

    setRank(
      response.data.rank
    );

  } catch(error) {

    console.error(error);

  }

};

  useEffect(() => {

    fetchUser();
    fetchPredictions();
    fetchStats();
    fetchRank();

  }, []);

    if (!user) {

    return (
      <div>
        <Navbar />
        <h2>Loading...</h2>
      </div>
    );

  }

return (

    <div>

      <Navbar />

      <div
        style={{
          maxWidth:"1000px",
          margin:"0 auto",
          padding:"30px"
        }}
      >

        <h1>
          👤 {user.name}
        </h1>
        {
  stats && (

    <div
      style={{
        display:"grid",
        gridTemplateColumns:
          "repeat(auto-fit,minmax(180px,1fr))",
        gap:"15px",
        marginTop:"20px",
        marginBottom:"20px"
      }}
    >

      <div style={{
        background:"#111827",
        padding:"15px",
        borderRadius:"12px"
      }}>
        <h3>🏆 Points</h3>
        <h1>{user.points}</h1>
      </div>

      <div style={{
        background:"#111827",
        padding:"15px",
        borderRadius:"12px"
      }}>
        <h3>🥇 Rank</h3>
        <h1>#{rank}</h1>
      </div>

      <div style={{
        background:"#111827",
        padding:"15px",
        borderRadius:"12px"
      }}>
        <h3>🎯 Predictions</h3>
        <h1>
          {stats.total_predictions}
        </h1>
      </div>

      <div style={{
        background:"#111827",
        padding:"15px",
        borderRadius:"12px"
      }}>
        <h3>✅ Correct</h3>
        <h1>
          {stats.correct_predictions || 0}
        </h1>
      </div>

      <div style={{
        background:"#111827",
        padding:"15px",
        borderRadius:"12px"
      }}>
        <h3>🎯 Perfect</h3>
        <h1>
          {stats.perfect_scores || 0}
        </h1>
      </div>

    </div>

  )
}

        <p>
          🏆 Points:
          {" "}
          {user.points}
        </p>

        <p>
          🔗
          {" "}
          {user.twitter_url}
        </p>

        <p>
          📅 Joined:
          {" "}
          {
            new Date(
              user.created_at
            ).toLocaleDateString()
          }
        </p>

        <hr />

        <h2>
          Recent Predictions
        </h2>

        {
          predictions.map(pred => (

            <div
              key={pred.id}
              style={{
                background:"#111827",
                border:
                  "1px solid #374151",
                borderRadius:"12px",
                padding:"15px",
                marginBottom:"10px"
              }}
            >

              <h3>
                {pred.home_team}
                {" vs "}
                {pred.away_team}
              </h3>

              <p>
                Prediction:
                {" "}
                {pred.prediction}
              </p>

              <p>
                Score:
                {" "}
                {pred.home_score}
                {" - "}
                {pred.away_score}
              </p>

              <p>
                Result:
                {" "}
                {
                  pred.result ||
                  "Pending"
                }
              </p>

            </div>

          ))
        }

      </div>

    </div>

  );

}

export default UserProfile;