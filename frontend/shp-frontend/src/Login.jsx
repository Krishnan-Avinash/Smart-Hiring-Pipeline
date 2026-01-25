import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit() {
    const obj = { email, password };
    const res = await axios.post("http://localhost:8080/auth/login", obj, {
      withCredentials: true,
    });
    console.log(res);
  }

  function navigation() {
    navigate("/protected");
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
      <input type="submit" onClick={handleSubmit} />
      <button onClick={navigation}>TEMP</button>
    </div>
  );
};

export default Login;
