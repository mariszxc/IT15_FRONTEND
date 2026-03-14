import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";
import eduManzanoLogo from "../assets/Edu manzanoPORTAL.png";
import { useAuth } from "../context/AuthContext";

function Login() {
  const [showLogin, setShowLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("Login failed. Please try again.");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const extractErrorMessage = (error) => {
    const response = error?.response?.data;
    if (response?.message) {
      return response.message;
    }

    const firstFieldError = response?.errors
      ? Object.values(response.errors).flat()?.[0]
      : null;
    return firstFieldError || "Login failed. Please try again.";
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setErrorMessage("");

    if (!email.trim() || !password) {
      setErrorMessage("Please enter your email and password.");
      return;
    }

    try {
      setIsSubmitting(true);

      await login({
        email: email.trim(),
        password,
      });

      navigate("/dashboard");
    } catch (error) {
      setErrorMessage(extractErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="app">
      <div
        className={`welcome-screen ${showLogin ? "blur" : ""} animated`}
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
                <input
                  type="email"
                  placeholder="maris@example.com"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                />
              </div>

              <div className="input-group password-group">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
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

              {errorMessage && <p className="login-error">{errorMessage}</p>}

              <button type="submit" className="login-btn" disabled={isSubmitting}>
                {isSubmitting ? "Logging in..." : "Login"}
              </button>

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
