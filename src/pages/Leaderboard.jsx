import {
  useEffect,
  useState
} from "react";

import {
  useNavigate
} from "react-router-dom";

import api from "../services/api";
import Navbar from "../components/Navbar";

function Leaderboard() {

  const [users, setUsers] =
    useState([]);

    const navigate =
  useNavigate();

    const currentUser =
  JSON.parse(
    localStorage.getItem("user")
  );

  useEffect(() => {

    fetchLeaderboard();

  }, []);
  

  const fetchLeaderboard = async () => {

    try {

      const response =
        await api.get(
          "/football/leaderboard"
        );

      setUsers(
        response.data.users
      );

    } catch (error) {

      console.error(error);

    }

  };

  const getRankTitle = (points) => {

  if (points >= 100)
    return "👑 Legend";

  if (points >= 50)
    return "🔥 Elite";

  if (points >= 25)
    return "⚡ Pro";

  if (points >= 10)
    return "⭐ Rising";

  return "🌱 Rookie";

};

  return (
    <div>

      <Navbar />

      <div
        style={{
          maxWidth: "900px",
          margin: "30px auto",
          padding: "20px"
        }}
      >

        <h1>
          🏆 Leaderboard
        </h1>

        {
          users.map(
            (
              user,
              index
            ) => (

              <div
                key={user.id}
style={{
  border:
    index === 0
      ? "2px solid gold"
      : index === 1
      ? "2px solid silver"
      : index === 2
      ? "2px solid #cd7f32"
      : "1px solid gray",

  background:
    currentUser?.id === user.id
      ? "rgba(255,215,0,0.08)"
      : "transparent",

  padding: "15px",
  marginBottom: "15px",
  borderRadius: "10px"
}}
              >

<h2>

  {
    index === 0
      ? "🥇"
      : index === 1
      ? "🥈"
      : index === 2
      ? "🥉"
      : `#${index + 1}`
  }

  {" "}

  <span
    onClick={() =>
      navigate(
        `/profile/${user.id}`
      )
    }
    style={{
textDecoration:"underline",
cursor:"pointer"
    }}
  >
    {user.name}
  </span>

</h2>
                <p>
  {getRankTitle(user.points)}
</p>
{
  currentUser?.id === user.id &&
  (
    <p>
      🫠 You
    </p>
  )
}

                <p>
                  ⭐ Points:
                  {" "}
                  {user.points}
                </p>

                <p>
                  ✅ Correct Predictions:
                  {" "}
                  {
                    user.correct_predictions
                  }
                </p>

                <p>
                  🎯 Perfect Scores:
                  {" "}
                  {
                    user.perfect_scores
                  }
                </p>


              </div>

            )
          )
        }

      </div>

    </div>
  );
}

export default Leaderboard;