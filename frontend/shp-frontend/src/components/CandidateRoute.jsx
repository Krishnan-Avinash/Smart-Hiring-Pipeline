import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import api from "../api/axios";

const CandidateRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [hasProfile, setHasProfile] = useState(false);

  useEffect(() => {
    async function checkProfile() {
      try {
        await api.get("/candidate/getSelf");
        setHasProfile(true);
      } catch {
        setHasProfile(false);
      } finally {
        setLoading(false);
      }
    }

    checkProfile();
  }, []);

  if (loading) return <div>Checking profile...</div>;

  if (!hasProfile) return <Navigate to="/candidate-setup" />;

  return children;
};

export default CandidateRoute;