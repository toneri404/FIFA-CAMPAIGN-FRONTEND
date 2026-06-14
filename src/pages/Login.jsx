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

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await api.post("/auth/login", {
        email,
        password
      });

      localStorage.setItem(
        "token",
        response.data.token
      );
      localStorage.setItem(
  "user",
  JSON.stringify(
    response.data.user
  )
);

      navigate("/dashboard");

      console.log(response.data);

    } catch (error) {

      setMessage(
        error.response?.data?.message ||
        "Login failed"
      );

    }
  };

 return (

  <div
    style={{
      minHeight: "100vh",
  
      background: "#020617",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      padding: "20px"
    }}
  >

    <div
      style={{
        width: "100%",
        width: "100%",
        maxWidth: "1400px",
        display: "grid",
        gridTemplateColumns: "1.3fr 1fr",
        gap: "80px",
        alignItems: "center"
      }}
    >

      {/* LEFT SIDE */}

      <div>


        <img
          src="/redstone-logo.svg"
          alt="logo"
          style={{
            width: "350px",
            marginBottom: "20px"
          }}
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
          FIFA Prediction Campaign
        </h1>

        <p
          style={{
            color: "#9CA3AF",
            fontSize: "18px",
            lineHeight: "1.6"
          }}
        >
Predict every FIFA World Cup match.
Compete with miners.
Earn points and dominate the leaderboard.
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

      <div
        style={{
          background: "#111827",
          border: "1px solid #374151",
          borderRadius: "20px",
          padding: "50px",
          boxShadow:
  "0 0 40px rgba(239,68,68,0.15)"
        }}
      >

<h2
  style={{
    color:"white",
    textAlign:"center",
    fontSize:"36px",
    marginBottom:"10px"
  }}
>
  Welcome Back
</h2>

<p
  style={{
    textAlign:"center",
    color:"#9CA3AF",
    marginBottom:"30px"
  }}
>
  Sign in to continue your campaign
</p>

        <form onSubmit={handleLogin}>

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
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
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
            Login
          </button>
          <p
  style={{
    color:"#9CA3AF",
    textAlign:"center",
    marginTop:"15px",
    fontSize:"14px"
  }}
>
  New accounts require administrator approval.
</p>

        </form>

        {
          message && (
            <p
              style={{
                color: "#ef4444",
                marginTop: "15px"
              }}
            >
              {message}
            </p>
          )
        }

        <p
          style={{
            textAlign: "center",
            marginTop: "20px",
            color: "#9CA3AF"
          }}
        >
          Don't have an account?

          <span
            onClick={() =>
              navigate("/register")
            }
            style={{
              color: "#ef4444",
              marginLeft: "5px",
              cursor: "pointer",
              fontWeight: "bold"
            }}
          >
            Register
          </span>

        </p>
        

      </div>
      
    </div>

  </div>

);
}
export default Login;