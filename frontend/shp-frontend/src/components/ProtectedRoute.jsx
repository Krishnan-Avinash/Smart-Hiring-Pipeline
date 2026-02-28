import React, { useEffect, useState } from "react";
import api from "../api/axios";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const [loggedin, setLoggedin] = useState(null);

  async function getLoggedin() {
    try {
      await api.get("/auth/get"); // ✅ cookie included
      setLoggedin(true);
    } catch {
      setLoggedin(false);
    }
  }

  useEffect(() => {
    getLoggedin();
  }, []);

  if (loggedin === null) return <div>Loading...</div>;

  return loggedin ? <Outlet /> : <Navigate to="/" replace />;
};

export default ProtectedRoute;