import React, { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import api from "../api/axios";

const RecruiterRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [hasRecruiterProfile, setHasRecruiterProfile] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    async function checkRecruiter() {
      try {
        const res = await api.get("/recruiter/getSelf");

        setHasRecruiterProfile(true);

        if (!res.data.companyId) {
          navigate("/company-setup");
        }

      } catch (err) {

        setHasRecruiterProfile(false);

      } finally {
        setLoading(false);
      }
    }

    checkRecruiter();
  }, [navigate]);

  if (loading) return <div>Checking recruiter profile...</div>;

  if (!hasRecruiterProfile) return <Navigate to="/company-setup" replace />;

  return children;
};

export default RecruiterRoute;