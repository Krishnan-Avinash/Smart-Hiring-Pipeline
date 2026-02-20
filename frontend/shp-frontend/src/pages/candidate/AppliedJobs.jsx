import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import { useNavigate } from "react-router-dom";
import "../../styles/appliedJobs.scss";

const AppliedJobs = () => {
  const [applications, setApplications] = useState([]);
  const navigate = useNavigate();

  // Fetch Candidate Applications
  async function fetchApplications() {
    try {
      const res = await api.get("/application/getMyApplications");
      setApplications(res.data);
    } catch (err) {
      console.error("Error fetching applications:", err);
    }
  }

  useEffect(() => {
    fetchApplications();
  }, []);

  return (
    <div className="applied">
      {/* Top Bar */}
      <div className="applied__top">
        <button onClick={() => navigate("/candidateLanding")}>
          ← Back to Jobs
        </button>

        <h1>My Applications</h1>
      </div>

      
      <div className="applied__list">
        {applications.length === 0 ? (
          <p className="empty">No applications submitted yet.</p>
        ) : (
          applications.map((app) => (
            <div key={app.applicationId} className="applied-card">
              <h3>{app.jobTitle}</h3>

              <p>Status: <span>{app.status}</span></p>

              <p>Final Score: {app.finalScore ?? "Pending"}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AppliedJobs;