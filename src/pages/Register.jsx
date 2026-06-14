import { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

const inputStyle = {
  width: "100%",
  padding: "14px",
  background: "#0f172a",
  border: "1px solid #374151",
  borderRadius: "12px",
  color: "white",
  marginBottom: "15px",
  boxSizing: "border-box"
};

function Register() {
const [name, setName] =
  useState("");

const [email, setEmail] =
  useState("");

const [twitterUrl,
  setTwitterUrl] =
  useState("");

const [password,
  setPassword] =
  useState("");

const [confirmPassword,
  setConfirmPassword] =
  useState("");

const [message,
  setMessage] =
  useState("");
  const navigate = useNavigate();

const handleRegister =
async (e) => {

  e.preventDefault();

  if (
    password !==
    confirmPassword
  ) {

    return setMessage(
      "Passwords do not match"
    );

  }

  try {

    const response =
      await api.post(
        "/auth/register",
        {
          name,
          email,
          twitter_url:
            twitterUrl,
          password
        }
      );

    setMessage(
      response.data.message
    );

    setName("");
    setEmail("");
    setTwitterUrl("");
    setPassword("");
    setConfirmPassword("");

  } catch (error) {

    setMessage(
      error.response?.data
        ?.message ||
      "Registration failed"
    );

  }

};

 return (

  <div className="auth-page">

    <div className="auth-layout">

      {/* LEFT SIDE */}

      <div
  style={{
    alignSelf: "start",
    paddingTop: "60px"
  }}
>


        <img
  src="/redstone-logo.svg"
  alt="RedStone"
  className="auth-logo"
/>

        <h1
          style={{
            color: "white",
            fontSize: "40px",
            fontWeight: "800",
             lineHeight: "1.1",
            marginBottom: "15px"
          }}
        >
          Join The Campaign
        </h1>

        <p
          style={{
            color: "#9CA3AF",
            fontSize: "18px",
            lineHeight: "1.6"
          }}
        >
Apply for access to the
RedStone Miners League.

Predict matches.
Compete against miners.
Climb the global leaderboard.
        </p>
        <div
  style={{
    marginTop:"30px",
    color:"#d1d5db",
    lineHeight:"2"
  }}
>
  <div>✓ Global Leaderboard</div>
  <div>✓ Live Match Predictions</div>
  <div>✓ Score Prediction Rewards</div>
  <div>✓ Exclusive Miner Competition</div>
</div>

      </div>

      {/* RIGHT SIDE */}

      <div className="auth-card">

<h2
  style={{
    color:"white",
    textAlign:"center",
    fontSize:"36px",
    marginBottom:"10px"
  }}
>
  Create Account
</h2>

<p
  style={{
    textAlign:"center",
    color:"#9CA3AF",
    marginBottom:"30px"
  }}
>
  Applications are manually reviewed by Miners Hub administrators.
</p>

        <form onSubmit={handleRegister}>


<input
  type="text"
  placeholder="Your Name"
  value={name}
  onChange={(e) =>
    setName(
      e.target.value
    )
  }
  style={inputStyle}
/>

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            style={inputStyle}
          />


<input
  type="text"
  placeholder="https://x.com/..."
  value={twitterUrl}
  onChange={(e) =>
    setTwitterUrl(
      e.target.value
    )
  }
  style={inputStyle}
/>


          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            style={inputStyle}
          />
 

<input
  type="password"
  placeholder="Confirm Password"
  value={confirmPassword}
  onChange={(e) =>
    setConfirmPassword(
      e.target.value
    )
  }
  style={inputStyle}
/>

          <button
            type="submit"
            style={{
              width: "100%",
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
            Apply For Access
          </button>

        </form>

{
  message && (

    <div
      style={{
        marginTop:"20px",
        padding:"15px",
        borderRadius:"12px",
        background:
          "rgba(34,197,94,0.1)",
        border:
          "1px solid #22c55e",
        color:"#86efac"
      }}
    >
      {message}
    </div>

  )
}

        <p
          style={{
            textAlign: "center",
            marginTop: "20px",
            color: "#9CA3AF"
          }}
        >
          Already have an account?

          <span
            onClick={() =>
              navigate("/")
            }
            style={{
              color: "#ef4444",
              marginLeft: "5px",
              cursor: "pointer",
              fontWeight: "bold"
            }}
          >
            Login
          </span>

        </p>

      </div>

    </div>

  </div>

);
}
export default Register;