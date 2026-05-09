import React, { useState } from "react";
import api from "../../api/axios";
import { Link, useNavigate } from "react-router-dom";
import { Snackbar, Alert } from "@mui/material";
import { motion } from "framer-motion";
import "../../styles/auth/login.scss";

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const showSnackbar = (msg, type = "success") => {
    setSnackbar({ open: true, message: msg, severity: type });
  };

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setLoading(true);

      await api.post(
        "/auth/login",
        { email, password },
        { withCredentials: true }
      );

      const userRes = await api.get("/auth/get", {
        withCredentials: true,
      });

      const user = userRes.data;

      showSnackbar("Welcome back ");

      setTimeout(() => {
        if (user.role === "CANDIDATE") {
          navigate("/candidateLanding", { replace: true });
        } else {
          navigate("/recruiterLanding", { replace: true });
        }
      }, 1000);

    } catch (err) {
      console.error(err);
      showSnackbar("Invalid credentials ❌", "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login">
      <div className="bg-glow"></div>

      {/* LEFT SIDE */}
      <div className="login-left">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <h1>
            Welcome back to <span>SmartHire</span>
          </h1>

          <p>
            Continue your hiring journey with AI-powered insights and
            faster recruitment workflows.
          </p>

          <div className="left-stats">
            <div>
              <h3>10k+</h3>
              <p>Users</p>
            </div>
            <div>
              <h3>24/7</h3>
              <p>Automation</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* RIGHT SIDE */}
      <motion.form
        className="login-card"
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2>Sign in</h2>

        {/* EMAIL */}
        <div className="input-group">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <label>Email</label>
        </div>

        {/* PASSWORD */}
        <div className="input-group password">
          <input
            type={showPassword ? "text" : "password"}
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <label>Password</label>

          <span
            className="toggle"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? "Hide" : "Show"}
          </span>
        </div>

        <button className="primary">
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="switch">
          Don’t have an account? <Link to="/register">Create one</Link>
        </p>
      </motion.form>

      {/* SNACKBAR */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity} variant="filled">
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Login;