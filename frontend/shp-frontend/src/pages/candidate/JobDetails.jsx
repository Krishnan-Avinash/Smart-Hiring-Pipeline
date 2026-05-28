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
  const [applied, setApplied] = useState(false);

  const [snackbar, setSnackbar] = useState("");

  /* ---------------- SNACKBAR ---------------- */
  function showSnackbar(msg) {
    setSnackbar(msg);
    setTimeout(() => setSnackbar(""), 3000);
  }

  /* ---------------- FETCH ---------------- */
  async function fetchJobDetails() {
    try {
      const res = await api.get(`/jobs/getJobById/${jobId}`);
      setJob(res.data);
    } catch (err) {
      console.error(err);
      showSnackbar("Failed to load job");
    }
  }

  async function checkApplication() {
    try {
      const res = await api.get(`/application/checkApplication/${jobId}`);

      if (res.data === true || res.data.applied === true) {
        setApplied(true);
      }
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    async function init() {
      setLoading(true);
      await Promise.all([fetchJobDetails(), checkApplication()]);
      setLoading(false);
    }

    init();
  }, [jobId]);

  /* ---------------- APPLY ---------------- */
  async function handleApply() {
    if (!resumeUrl.trim()) {
      showSnackbar("Please enter resume link");
      return;
    }

    if (!resumeUrl.includes("drive.google.com")) {
      showSnackbar("Use a valid Google Drive link");
      return;
    }

    try {
      setApplyLoading(true);

      await api.post(`/application/createApplication/${jobId}`, {
        appliedResumeUrl: resumeUrl,
      });

      setApplied(true);
      setResumeUrl("");

      showSnackbar("Application submitted 🚀");
    } catch (err) {
      console.error(err);
      showSnackbar(err.response?.data || "Failed to apply");
    } finally {
      setApplyLoading(false);
    }
  }

  /* ---------------- STATES ---------------- */
  if (loading) {
    return <div className="jobdetails-loading">Loading Job Details...</div>;
  }

  if (!job) {
    return (
      <div className="jobdetails-loading">
        <p>Job not found</p>
        <button
          onClick={() => navigate("/candidateLanding")}
          className="back-btn"
        >
          Back to Jobs
        </button>
      </div>
    );
  }

  /* ---------------- SKILLS ---------------- */
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

        {/* FIXED company field */}
        <p className="company">{job.companyName}</p>

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

        {/* RESUME BOX */}
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
        </div>
      </div>

      {/* SNACKBAR */}
      {snackbar && <div className="job-snackbar">{snackbar}</div>}
    </div>
  );
};

export default JobDetails;