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

  // Fetch Job Details
  async function fetchJobDetails() {
    try {
      const res = await api.get(`/jobs/getJobById/${jobId}`);
      setJob(res.data);
    } catch (err) {
      console.error("Error fetching job details:", err);
      setError("Job not found or server error.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchJobDetails();
  }, []);

  // Apply Job
  async function handleApply() {
    setError("");
    setMessage("");

    if (!resumeUrl.trim()) {
      setError("Please provide your resume Google Drive link.");
      return;
    }

    try {
      setApplyLoading(true);

      // ✅ Send resumeUrl as request body
      const res = await api.post(
        `/application/createApplication/${jobId}`,
        {
          resumeUrl: resumeUrl,
        }
      );

      console.log("Application Response:", res.data);

      setMessage(
        "Application submitted successfully! Resume scoring will appear soon."
      );
    } catch (err) {
      console.error("Apply Error:", err);
      setError("Failed to apply. Please try again.");
    } finally {
      setApplyLoading(false);
    }
  }

  // Loading UI
  if (loading) {
    return <div className="jobdetails-loading">Loading Job Details...</div>;
  }

  // Error UI
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

  // ✅ Combine both skill fields
  const allSkills = (
    (job.requiredSkills || "") +
    "," +
    (job.prioritySkills || "")
  )
    .split(",")
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  return (
    <div className="jobdetails">
      {/* Top Bar */}
      <div className="jobdetails__topbar">
        <button
          className="back-btn"
          onClick={() => navigate("/candidateLanding")}
        >
          ← Back to Jobs
        </button>
      </div>

      {/* Job Card */}
      <div className="jobdetails__card">
        <h1>{job.title}</h1>

        <p className="company">{job.company?.name}</p>

        <div className="info">
          <span>📍 {job.location}</span>
          <span>💼 {job.employmentType}</span>
          <span>
            ⏳ {job.experienceMin}–{job.experienceMax} yrs
          </span>
        </div>

        <p className="desc">{job.description}</p>

        {/* Skills */}
        <div className="skills">
          {allSkills.map((skill, i) => (
            <span key={i}>{skill}</span>
          ))}
        </div>

        {/* Resume Upload */}
        <div className="resume-box">
          <h3>Upload Resume Link</h3>

          <input
            type="text"
            placeholder="Paste Google Drive Resume Link..."
            value={resumeUrl}
            onChange={(e) => setResumeUrl(e.target.value)}
          />

          <button
            className="apply-btn"
            onClick={handleApply}
            disabled={applyLoading}
          >
            {applyLoading ? "Applying..." : "Apply Now 🚀"}
          </button>

          {/* Messages */}
          {message && <p className="success-msg">{message}</p>}
          {error && <p className="error-msg">{error}</p>}
        </div>

        {/* ATS Score Placeholder */}
        <div className="ats-box">
          <h3>ATS Resume Score</h3>
          <p>
            Score...
          </p>
        </div>
      </div>
    </div>
  );
};

export default JobDetails;