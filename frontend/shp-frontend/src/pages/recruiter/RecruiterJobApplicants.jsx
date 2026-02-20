import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/axios";
import "../../styles/recruiterApplicants.scss";

const RecruiterJobApplicants = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch Applicants for Job
  async function fetchApplicants() {
    try {
      const res = await api.get(
        `/application/getApplicationsForAJob/${jobId}`
      );
      setApplications(res.data);
    } catch (err) {
      console.error("Error fetching applicants:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchApplicants();
  }, []);

  if (loading) {
    return <p className="loading">Loading Applicants...</p>;
  }

  return (
    <div className="applicants">
      <button className="back-btn" onClick={() => navigate("/recruiterLanding")}>
        ← Back to Dashboard
      </button>

      <h1>Applicants for Job #{jobId}</h1>

      {applications.length === 0 ? (
        <p>No applications yet.</p>
      ) : (
        <div className="applicants__grid">
          {applications.map((app) => (
            <div key={app.applicationId} className="app-card">
              <h3>{app.name}</h3>
              <p>{app.email}</p>

              <p>
                Resume:{" "}
                <a href={app.resumeUrl} target="_blank">
                  View Link
                </a>
              </p>

              <div className="scores">
                <p>AI Score: {app.aiScore ?? "Pending"}</p>
                <p>Keyword Score: {app.keywordScore ?? "Pending"}</p>
                <h2>Final ATS Score: {app.finalScore ?? "Pending"}</h2>
              </div>

              <p className="status">Status: {app.status}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecruiterJobApplicants;