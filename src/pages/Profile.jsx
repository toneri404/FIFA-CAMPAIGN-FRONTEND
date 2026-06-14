import { useEffect, useState } from "react";
import api from "../services/api";
import Navbar from "../components/Navbar";

function Profile() {

  const [user, setUser] =
    useState(null);

  const [stats, setStats] =
    useState({});

  useEffect(() => {

    fetchProfile();

  }, []);

  const fetchProfile = async () => {

    try {

      const token =
        localStorage.getItem("token");

      const response =
        await api.get(
          "/football/profile",
          {
            headers: {
              Authorization: token
            }
          }
        );

      setUser(
        response.data.user
      );

      setStats(
        response.data.stats
      );

    } catch (error) {

      console.error(error);

    }

  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div>

      <Navbar />

      <div
        style={{
          maxWidth: "800px",
          margin: "30px auto",
          padding: "20px"
        }}
      >

<div
  style={{
    textAlign:"center",
    marginBottom:"30px"
  }}
>
  <div
    style={{
      width:"120px",
      height:"120px",
      borderRadius:"50%",
      background:"#ef4444",
      margin:"0 auto 15px",
      display:"flex",
      alignItems:"center",
      justifyContent:"center",
      fontSize:"50px",
      fontWeight:"bold"
    }}
  >
    {user.name[0].toUpperCase()}
  </div>

  <h1
    style={{
      marginBottom:"10px"
    }}
  >
    {user.name}
  </h1>

  <p
    style={{
      color:"#9CA3AF"
    }}
  >
    {user.email}
  </p>

  <h2
    style={{
      color:"#ef4444",
      marginTop:"15px"
    }}
  >
    🏆 {user.points} Points
  </h2>
</div>

        <hr />

        <h2>
          Total Points:
          {" "}
          {user.points}
        </h2>

        <hr />

        <h2>
          Statistics
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(2, 1fr)",
            gap: "15px",
            marginTop: "20px"
          }}
        >

          <div
            style={{
              border: "1px solid gray",
              padding: "15px"
            }}
          >
            <h3>
              Predictions Made
            </h3>

            <p>
              {stats.predictions || 0}
            </p>
          </div>

          <div
            style={{
              border: "1px solid gray",
              padding: "15px"
            }}
          >
            <h3>
              Correct Predictions
            </h3>

            <p>
              {stats.correct || 0}
            </p>
          </div>

          <div
            style={{
              border: "1px solid gray",
              padding: "15px"
            }}
          >
            <h3>
              Wrong Predictions
            </h3>

            <p>
              {stats.wrong || 0}
            </p>
          </div>

          <div
            style={{
              border: "1px solid gray",
              padding: "15px"
            }}
          >
            <h3>
              Perfect Scores
            </h3>

            <p>
              {stats.perfect || 0}
            </p>
          </div>

          <div
            style={{
              border: "1px solid gray",
              padding: "15px"
            }}
          >
            <h3>
              Close Scores
            </h3>

            <p>
              {stats.close || 0}
            </p>
          </div>

          <div
            style={{
              border: "1px solid gray",
              padding: "15px"
            }}
          >
            <h3>
              Accuracy
            </h3>

            <p>
              {stats.accuracy || 0}%
            </p>
          </div>

        </div>

        <hr
          style={{
            marginTop: "30px",
            marginBottom: "20px"
          }}
        />

        <h2>
          Achievements
        </h2>

        {
          stats.achievements &&
          stats.achievements.length > 0
            ? (
              <div
                style={{
                  marginTop: "20px"
                }}
              >

                {
                  stats.achievements.map(
                    (
                      achievement,
                      index
                    ) => (

                      <div
                        key={index}
                        style={{
                          border:
                            "1px solid gold",
                          padding:
                            "12px",
                          marginBottom:
                            "10px",
                          borderRadius:
                            "8px"
                        }}
                      >
                        {achievement}
                      </div>

                    )
                  )
                }

              </div>
            )
            : (
              <p>
                No achievements unlocked yet.
              </p>
            )
        }

      </div>

    </div>
  );
}

export default Profile;