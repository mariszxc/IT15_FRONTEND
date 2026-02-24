import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";
import eduManzanoLogo from "../assets/Edu manzanoPORTAL.png";

function Login() {
  const [showLogin, setShowLogin] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [animateBlobs, setAnimateBlobs] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setAnimateBlobs(true);
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    navigate("/dashboard");
  };

  return (
    <div className="app">
      <div
        className={`welcome-screen ${showLogin ? "blur" : ""} ${
          animateBlobs ? "animated" : ""
        }`}
      >
        <div className="blob-aux" aria-hidden="true"></div>
        <img
          className="welcome-logo"
          src={eduManzanoLogo}
          alt="EDU Manzano logo"
        />
        <h1>WELCOME TO</h1>
        <h2>STUDENT PORTAL</h2>
        {!showLogin && <p>Login to access your account</p>}

        <button className="welcome-login-btn" onClick={() => setShowLogin(true)}>
          Login
        </button>
      </div>

      {showLogin && (
        <>
          <div className="overlay" onClick={() => setShowLogin(false)}></div>

          <div className="login-modal">
            <h2>Login</h2>
            <p className="sub-text">Enter your account details</p>

            <form onSubmit={handleSubmit}>
              <div className="input-group">
                <input type="text" placeholder="Username" />
              </div>

              <div className="input-group password-group">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>

              <div className="forgot">
                <a href="#">Forgot Password?</a>
              </div>

              <button type="submit" className="login-btn">
                Login
              </button>

              <p className="register">
                Don&apos;t have an account yet? <a href="#">Register</a>
              </p>
            </form>

            <button className="close-btn" onClick={() => setShowLogin(false)}>
              ✕
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default Login;
