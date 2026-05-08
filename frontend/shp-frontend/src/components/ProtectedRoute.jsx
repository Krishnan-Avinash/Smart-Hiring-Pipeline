import React, { useEffect, useState } from "react";
import api from "../api/axios";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const [loggedIn, setLoggedIn] = useState(null);

  useEffect(() => {
    async function checkAuth() {
      try {
        await api.get("/auth/get");
        setLoggedIn(true);
      } catch {
        setLoggedIn(false);
      }
    }

    checkAuth();
  }, []);

  if (loggedIn === null) return <div>Loading...</div>;

  return loggedIn ? <Outlet /> : <Navigate to="/" replace />;
};

export default ProtectedRoute;