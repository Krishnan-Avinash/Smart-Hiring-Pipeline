import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [userName, setUserName] = useState("");
  const [role, setRole] = useState("RECRUITER");

  async function handleSubmit() {
    const obj = { email, password, confirmPassword, userName, role };
    console.log(obj);
    const res = await axios.post("http://localhost:8080/user/createUser", obj, {
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
        onChange={(e) => setUserName(e.target.value)}
        placeholder="enter userName"
      />
      <br />
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
      <br />
      <input
        type="password"
        onChange={(e) => setConfirmPassword(e.target.value)}
        placeholder="retype password"
      />
      <br />
      <select id="roles" name="roles" onChange={(e) => setRole(e.target.value)}>
        <option value="RECRUITER">RECRUITER</option>
        <option value="CANDIDATE">CANDIDATE</option>
      </select>
      <br />
      <Link to="/">Already have an account?</Link>
      <input type="submit" onClick={handleSubmit} />
      <button onClick={navigation}>TEMP</button>
    </div>
  );
};

export default Register;
