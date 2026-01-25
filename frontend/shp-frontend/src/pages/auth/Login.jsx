import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit() {
    const obj = { email, password };
    const res = await axios.post("http://localhost:8080/auth/login", obj, {
      withCredentials: true,
    });
    if (res.status == 200) {
      navigate("/temp");
    }
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
