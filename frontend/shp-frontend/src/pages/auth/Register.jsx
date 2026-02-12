import React, { useState } from "react";
import api from "../../api/axios";
import { Link, useNavigate } from "react-router-dom";
import "../../styles/auth/register.scss";

const Register = () => {
  const navigate = useNavigate();

  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("RECRUITER");

  async function handleSubmit(e) {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      await api.post("/user/createUser", {
        userName,
        email,
        password,
        confirmPassword,
        role,
      });

      navigate("/"); // back to login after success
    } catch (err) {
      console.error(err);
      alert("Registration failed");
    }
  }

  return (
    <div className="auth">
      <form className="auth__card" onSubmit={handleSubmit}>
        <h1 className="auth__title">Create account</h1>
        <p className="auth__subtitle">
          Join Smart Hiring Pipeline in seconds
        </p>

        <div className="auth__field">
          <label>Username</label>
          <input
            type="text"
            placeholder="Enter your username"
            value={userName}
            required
            onChange={(e) => setUserName(e.target.value)}
          />
        </div>

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
            placeholder="Create a password"
            value={password}
            required
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className="auth__field">
          <label>Confirm password</label>
          <input
            type="password"
            placeholder="Re-enter your password"
            value={confirmPassword}
            required
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>

        <div className="auth__field">
          <label>Role</label>
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="RECRUITER">Recruiter</option>
            <option value="CANDIDATE">Candidate</option>
          </select>
        </div>

        <button type="submit" className="auth__button">
          Create account
        </button>

        <p className="auth__footer">
          Already have an account? <Link to="/">Login</Link>
        </p>
      </form>
    </div>
  );
};

export default Register;
