import React, { useEffect, useState } from "react";
import axios from "axios";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const [loggedin, setLoggedin] = useState(null);

  async function getLoggedin() {
    try {
      await axios.get("http://localhost:8080/auth/get", {
        withCredentials: true,
      });
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
