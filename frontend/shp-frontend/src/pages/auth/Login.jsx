import React, { useState } from "react";
import api from "../../api/axios";
import { Link, useNavigate } from "react-router-dom";
import "../../styles/auth/login.scss";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(e) {
    e.preventDefault(); // important for form submit

    try {
      const loginRes = await api.post("/auth/login", { email, password });

      if (loginRes.status === 200) {
        const roleRes = await api.get("/auth/get");
        const role = roleRes.data.role;

        if (role === "CANDIDATE") {
          navigate("/candidateLanding");
        } else if (role === "RECRUITER") {
          navigate("/recruiterLanding");
        }
      }
    } catch (err) {
      console.error(err);
      alert("Login failed");
    }
  }

  return (
    <div className="auth">
      <form className="auth__card" onSubmit={handleSubmit}>
        <h1 className="auth__title">Welcome back</h1>
        <p className="auth__subtitle">
          Sign in to continue to Smart Hiring Pipeline
        </p>

        <div className="auth__field">
          <label>Email</label>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            required
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="auth__field">
          <label>Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            required
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button type="submit" className="auth__button">
          Login
        </button>

        <p className="auth__footer">
          Don’t have an account? <Link to="/register">Create one</Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
