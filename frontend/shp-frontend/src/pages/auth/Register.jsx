import React, { useState } from "react";
import api from "../../api/axios";
import { Link, useNavigate } from "react-router-dom";
import { Snackbar, Alert } from "@mui/material";
import { motion } from "framer-motion";
import "../../styles/auth/register.scss";

const Register = () => {
  const navigate = useNavigate();

  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [role, setRole] = useState("RECRUITER");
  const [designation, setDesignation] = useState("");

  const [loading, setLoading] = useState(false);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  async function handleSubmit(e) {
    e.preventDefault();

    if (password !== confirmPassword) {
      showSnackbar("Passwords do not match", "error");
      return;
    }

    try {
      setLoading(true);

      await api.post("/user/createUser", {
        userName,
        email,
        password,
        confirmPassword,
        role,
      });

      await api.post("/auth/login", { email, password });

      if (role === "RECRUITER") {
        await api.post("/recruiter/createNewRecruiter", {
          designation,
          email,
        });
      }

      showSnackbar("Account created successfully!");

      setTimeout(() => navigate("/"), 1200);
    } catch {
      showSnackbar("Registration failed ❌", "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="register">
      <div className="bg-glow"></div>

      {/* LEFT SIDE */}
      <div className="register-left">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <h1>
            Build your future with <span>SmartHire</span>
          </h1>

          <p>
            AI-powered hiring platform for recruiters and candidates.
            Faster hiring. Smarter decisions.
          </p>

          <div className="left-stats">
            <div>
              <h3>10k+</h3>
              <p>Users</p>
            </div>
            <div>
              <h3>95%</h3>
              <p>Accuracy</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* RIGHT SIDE */}
      <motion.form
        className="register-card"
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2>Create account</h2>

        {/* FLOATING INPUTS */}
        <div className="input-group">
          <input
            type="text"
            required
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
          />
          <label>Username</label>
        </div>

        <div className="input-group">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <label>Email</label>
        </div>

        <div className="input-group">
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <label>Password</label>
        </div>

        <div className="input-group">
          <input
            type="password"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <label>Confirm Password</label>
        </div>

        {/* 🔥 CUSTOM ROLE SELECT */}
        <div className="role-toggle">
          <div
            className={role === "RECRUITER" ? "active" : ""}
            onClick={() => setRole("RECRUITER")}
          >
            Recruiter
          </div>

          <div
            className={role === "CANDIDATE" ? "active" : ""}
            onClick={() => setRole("CANDIDATE")}
          >
            Candidate
          </div>
        </div>

        {role === "RECRUITER" && (
          <div className="input-group">
            <input
              type="text"
              required
              value={designation}
              onChange={(e) => setDesignation(e.target.value)}
            />
            <label>Designation</label>
          </div>
        )}

        <button className="primary">
          {loading ? "Creating..." : "Create Account"}
        </button>

        <p className="switch">
          Already have an account? <Link to="/login">Login</Link>
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

export default Register;