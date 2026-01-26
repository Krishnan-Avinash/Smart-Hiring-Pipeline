import React, { useState } from "react";
import api from "../../api/axios";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit() {
    try {
      const loginRes = await api.post("/auth/login", { email, password });

      if (loginRes.status === 200) {
        const role = await getRole();

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

  async function getRole() {
    const res = await api.get("/auth/get");
    return res.data.role;
  }

  return (
    <div>
      <input
        type="text"
        onChange={(e) => setEmail(e.target.value)}
        placeholder="enter email"
      />

      <br />
      <input
        type="password"
        onChange={(e) => setPassword(e.target.value)}
        placeholder="enter password"
      />
      <Link to="/register">Don't have an account?</Link>
      <input type="submit" onClick={handleSubmit} />
    </div>
  );
};

export default Login;
