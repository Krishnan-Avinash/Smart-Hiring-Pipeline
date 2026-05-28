import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import { useNavigate } from "react-router-dom";

const AppliedJobs = () => {

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await api.get("/application/myApplications", {
          withCredentials: true,
        });
        setApplications(res.data || []);
      } catch (error) {
        console.error("Error fetching applications:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  const steps = ["APPLIED", "SHORTLISTED", "INTERVIEW", "SELECTED"];
  const getStepIndex = (status) => steps.indexOf(status);

  if (loading) {
    return <div className="applied__loading">Loading applications...</div>;
  }

  return (
    <div className="applied-page">

      {/* BLUR BACKGROUND */}
      <div className={`applied ${selectedApp ? "blur" : ""}`}>

        <div className="applied__wrapper">

          <div className="applied__top">
            <h1>My Applications</h1>
            <button onClick={() => navigate("/candidateLanding")}>
              ← Back to Jobs
            </button>
          </div>

          {applications.length === 0 ? (

            <div className="empty">
              <h3>No Applications Yet</h3>
              <p>You haven't applied to any jobs yet.</p>
              <button onClick={() => navigate("/candidateLanding")}>
                Browse Jobs
              </button>
            </div>

          ) : (

            <div className="cards-list">
              {applications.map((app) => (

                <div key={app.applicationId} className="applied-card">

                  <div className="applied-card__left">
                    <h3>{app.jobTitle}</h3>
                    <div className="company">{app.companyName}</div>
                    <div className="industry">{app.industry}</div>
                    <div className="meta">
                      Applied on:{" "}
                      {app.appliedAt
                        ? new Date(app.appliedAt).toLocaleDateString()
                        : "N/A"}
                    </div>
                    {app.websiteUrl && (
                      <a
                        href={app.websiteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Visit Website
                      </a>
                    )}
                  </div>

                  <div className="applied-card__right">
                    <div className={`status ${app.status?.toLowerCase()}`}>
                      {app.status}
                    </div>
                    <button
                      className="details-btn"
                      onClick={() => setSelectedApp(app)}
                    >
                      View Details
                    </button>
                  </div>

                </div>

              ))}
            </div>

          )}

        </div>
      </div>

      {/* MODAL */}
      {selectedApp && (

        <div className="modal-overlay" onClick={() => setSelectedApp(null)}>

          <div
            className="application-modal"
            onClick={(e) => e.stopPropagation()}
          >

            <h2>{selectedApp.jobTitle}</h2>

            {/* JOB DETAILS */}
            <div className="modal-section">
              <h3>Job Details</h3>
              <p><b>Location:</b> {selectedApp.location}</p>
              <p><b>Employment Type:</b> {selectedApp.employmentType}</p>
              <p>
                <b>Experience:</b> {selectedApp.experienceMin} - {selectedApp.experienceMax} years
              </p>
            </div>

            {/* COMPANY DETAILS */}
            <div className="modal-section">
              <h3>Company Details</h3>
              <p><b>Name:</b> {selectedApp.companyName}</p>
              <p><b>Industry:</b> {selectedApp.industry}</p>
              <p><b>Description:</b> {selectedApp.companyDescription}</p>
              {selectedApp.websiteUrl && (
                <a
                  href={selectedApp.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Visit Company Website
                </a>
              )}
            </div>

            {/* TIMELINE */}
            <div className="modal-section">
              <h3>Application Timeline</h3>
              <div className="stepper">
                {steps.map((step, index) => {
                  const currentIndex = getStepIndex(selectedApp.status);
                  return (
                    <div
                      key={step}
                      className={`step ${index <= currentIndex ? "active" : ""}`}
                    >
                      <div className="circle"></div>
                      <div className="label">{step}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            <button className="close-btn" onClick={() => setSelectedApp(null)}>
              Close
            </button>

          </div>

        </div>

      )}

    </div>
  );
};

export default AppliedJobs;