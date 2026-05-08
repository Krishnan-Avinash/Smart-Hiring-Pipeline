import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/axios";
import "../../styles/jobDetails.scss";

const JobDetails = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [resumeUrl, setResumeUrl] = useState("");
  const [loading, setLoading] = useState(true);

  const [applyLoading, setApplyLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [applied, setApplied] = useState(false);

  async function fetchJobDetails() {
    try {
      const res = await api.get(`/jobs/getJobById/${jobId}`);
      setJob(res.data);
    } catch (err) {
      console.error("Error fetching job details:", err);
      setError("Job not found or server error.");
    }
  }

  async function checkApplication() {
    try {
      const res = await api.get(`/application/checkApplication/${jobId}`);

      if (res.data === true || res.data.applied === true) {
        setApplied(true);
      }
    } catch (err) {
      console.error("Check Application Error:", err);
    }
  }

  useEffect(() => {
    async function init() {
      await fetchJobDetails();
      await checkApplication();
      setLoading(false);
    }

    init();
  }, [jobId]);

async function handleApply() {
  setError("");
  setMessage("");

  if (!resumeUrl.trim()) {
    setError("Please provide your resume Google Drive link.");
    return;
  }

  try {
    setApplyLoading(true);

    await api.post(`/application/createApplication/${jobId}`, {
      appliedResumeUrl: resumeUrl,
    });

    setMessage("Application submitted successfully!");
    setApplied(true);
    setResumeUrl("");
  } catch (err) {
    console.error("Apply Error:", err);
    setError(err.response?.data || "Failed to apply. Please try again.");
  } finally {
    setApplyLoading(false);
  }
}

  if (loading) {
    return <div className="jobdetails-loading">Loading Job Details...</div>;
  }

  if (error && !job) {
    return (
      <div className="jobdetails-loading">
        <p>{error}</p>
        <button
          onClick={() => navigate("/candidateLanding")}
          className="back-btn"
        >
          Back to Jobs
        </button>
      </div>
    );
  }

  const allSkills = (
    (job.requiredSkills || "") + "," + (job.prioritySkills || "")
  )
    .split(",")
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  return (
    <div className="jobdetails">
      <div className="jobdetails__topbar">
        <button
          className="back-btn"
          onClick={() => navigate("/candidateLanding")}
        >
          ← Back to Jobs
        </button>
      </div>

      <div className="jobdetails__card">
        <h1>{job.title}</h1>

        <p className="company">{job.company?.name}</p>

        {applied && (
          <div className="applied-badge">
            ✅ Already Applied
          </div>
        )}

        <div className="info">
          <span>📍 {job.location}</span>
          <span>💼 {job.employmentType}</span>
          <span>
            ⏳ {job.experienceMin}–{job.experienceMax} yrs
          </span>
        </div>

        <p className="desc">{job.description}</p>

        <div className="skills">
          {allSkills.map((skill, i) => (
            <span key={i}>{skill}</span>
          ))}
        </div>

        {/* Resume Box */}

        <div className={`resume-box ${applied ? "disabled" : ""}`}>
          <h3>Upload Resume Link</h3>

          <input
            type="text"
            placeholder="Paste Google Drive Resume Link..."
            value={resumeUrl}
            onChange={(e) => setResumeUrl(e.target.value)}
            disabled={applied}
          />

          <button
            className="apply-btn"
            onClick={handleApply}
            disabled={applyLoading || applied}
          >
            {applyLoading
              ? "Applying..."
              : applied
              ? "Applied ✅"
              : "Apply Now 🚀"}
          </button>

          {message && <p className="success-msg">{message}</p>}
          {error && <p className="error-msg">{error}</p>}
        </div>
      </div>
    </div>
  );
};

export default JobDetails;