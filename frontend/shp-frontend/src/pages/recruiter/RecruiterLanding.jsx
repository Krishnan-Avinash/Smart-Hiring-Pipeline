import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import "../../styles/recruiterLanding.scss";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "../../context/SnackbarContext";

const RecruiterLanding = () => {
  
  const [jobs, setJobs] = useState([]);
  const [user, setUser] = useState(null);

  const [showForm, setShowForm] = useState(false);

  const [jobData, setJobData] = useState({
    title: "",
    description: "",
    location: "",
    employmentType: "",
    experienceMin: "",
    experienceMax: "",
    requiredSkills: "",
    prioritySkills: "",
    status: "OPEN",
  });

  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();

  async function getRecruiterProfile() {
    try {
      const res = await api.get("/auth/get");
      setUser(res.data);
      getRecruiterJobs();
    } catch (err) {
  console.error(err);

  if (![401, 403].includes(err.response?.status)) {
    showSnackbar("Failed to load profile");
  }
}
  }

  async function getRecruiterJobs() {
    try {
      const res = await api.get("/jobs/getJobsOfARecruiter");
      setJobs(res.data);
    } catch (err) {
  console.error(err);

  if (![401, 403].includes(err.response?.status)) {
    showSnackbar("Failed to load jobs");
  }
}
  }

  function handleChange(e) {
    setJobData({ ...jobData, [e.target.name]: e.target.value });
  }

  async function handleCreateJob(e) {
    e.preventDefault();

    try {
      await api.post("/jobs/createNewJob", jobData);

      showSnackbar("Job created successfully");
      getRecruiterJobs();

      setJobData({
        title: "",
        description: "",
        location: "",
        employmentType: "",
        experienceMin: "",
        experienceMax: "",
        requiredSkills: "",
        prioritySkills: "",
        status: "OPEN",
      });

      setShowForm(false);
    } catch (err) {
  console.error(err);

  if (![401, 403].includes(err.response?.status)) {
    showSnackbar(
      err.response?.data || "Failed to create job"
    );
  }
}
  }

  async function handleJobStatus(job, newStatus) {
  try {
    await api.put(`/jobs/updateJobById/${job.jobId}`, {
      title: job.title,
      description: job.description,
      location: job.location,
      employmentType: job.employmentType,
      experienceMin: job.experienceMin,
      experienceMax: job.experienceMax,
      requiredSkills: job.requiredSkills,
      prioritySkills: job.prioritySkills,
      status: newStatus,
    });

    getRecruiterJobs();
  } catch (err) {
  console.error(err);

  if (![401, 403].includes(err.response?.status)) {
    showSnackbar("Failed to update job status");
  }
}
}

  async function handleLogout() {
    try {
      await api.post("/auth/logout");
      navigate("/");
    } catch (err) {
  console.error(err);

  if (![401, 403].includes(err.response?.status)) {
    showSnackbar("Logout failed");
  }
}
  }

  useEffect(() => {
    getRecruiterProfile();
  }, []);

  return (
    <div className="recruiter">
      {/* Navbar */}
      <nav className="recruiter__navbar">
        <div className="recruiter__logo">
          Smart<span>Hire</span>
        </div>

        <div className="recruiter__navRight">
          {user && (
            <p className="recruiter__username">
              Welcome, <span>{user.userName}</span>
            </p>
          )}

          <button onClick={() => navigate("/recruiter/profile")}>
            Profile
            </button>

          <button
            className="recruiter__createBtn"
            onClick={() => setShowForm(!showForm)}
          >
            + Create Job
          </button>

          <button onClick={handleLogout} className="recruiter__logoutBtn">
            Logout
          </button>
        </div>
      </nav>

      {/* Header */}
      <div className="recruiter__header">
        <h1>Recruiter Dashboard</h1>
        <p>Manage jobs created by you and review applicants.</p>
      </div>

      {/* Job Form */}
      {showForm && (
        <div className="jobform">
          <h2>Create New Job</h2>

          <form onSubmit={handleCreateJob}>
            <input
              type="text"
              name="title"
              placeholder="Job Title"
              value={jobData.title}
              onChange={handleChange}
              required
            />

            <textarea
              name="description"
              placeholder="Job Description"
              value={jobData.description}
              onChange={handleChange}
              required
            />

            <input
              type="text"
              name="location"
              placeholder="Location"
              value={jobData.location}
              onChange={handleChange}
              required
            />

            <input
              type="text"
              name="employmentType"
              placeholder="Employment Type"
              value={jobData.employmentType}
              onChange={handleChange}
              required
            />

            <div className="row">
              <input
                type="number"
                name="experienceMin"
                placeholder="Min Experience"
                value={jobData.experienceMin}
                onChange={handleChange}
                required
              />

              <input
                type="number"
                name="experienceMax"
                placeholder="Max Experience"
                value={jobData.experienceMax}
                onChange={handleChange}
                required
              />
            </div>

            <input
              type="text"
              name="requiredSkills"
              placeholder="Required Skills"
              value={jobData.requiredSkills}
              onChange={handleChange}
              required
            />

            <input
              type="text"
              name="prioritySkills"
              placeholder="Priority Skills"
              value={jobData.prioritySkills}
              onChange={handleChange}
            />

            <button type="submit">Post Job</button>
          </form>
        </div>
      )}

      {/* Jobs List */}
      <div className="recruiter__grid">
        {jobs.map((job) => (
          <div className="job-card" key={job.jobId}>

            <div className="job-card__top">
              <h3>{job.title}</h3>

              <span
  className={`status ${job.status.toLowerCase()} clickable-status`}
  onClick={(e) => {
    e.stopPropagation();

    handleJobStatus(
      job,
      job.status === "OPEN"
        ? "CLOSED"
        : "OPEN"
    );
  }}
  title={
    job.status === "OPEN"
      ? "Click to close job"
      : "Click to reopen job"
  }
>
  {job.status}
</span>
            </div>

            <p className="company">{job.companyName}</p>

            <p className="location">📍 {job.location}</p>

            <div className="meta">
              <span>
                Experience: {job.experienceMin} – {job.experienceMax} yrs
              </span>

              <span className="employment">{job.employmentType}</span>
            </div>

<div className="job-card__actions">

  <button
    className="applicants-btn"
    onClick={(e) => {
      e.stopPropagation();
      navigate(`/recruiter/job/${job.jobId}`);
    }}
  >
    View Applicants →
  </button>

</div>

          </div>
        ))}
      </div>
    </div>
  );
};

export default RecruiterLanding;