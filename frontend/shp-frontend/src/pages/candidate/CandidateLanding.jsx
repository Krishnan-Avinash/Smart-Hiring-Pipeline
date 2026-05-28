import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import { Link, useNavigate } from "react-router-dom";
import "../../styles/candidateLanding.scss";

const CandidateLanding = () => {
  const [jobs, setJobs] = useState([]);
  const [user, setUser] = useState(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [showDropdown, setShowDropdown] = useState(false);

  const navigate = useNavigate();


  async function getJobs() {
    try {
      const res = await api.get("/jobs/getAllJobs");
      setJobs(res.data);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    }
  }

  async function getUserProfile() {
    try {
      const res = await api.get("/auth/get");
      setUser(res.data);
    } catch (err) {
      console.error("Error fetching user profile:", err);
    }
  }

  async function handleLogout() {
    try {
      await api.post("/auth/logout");
      navigate("/");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  }

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      await Promise.all([getJobs(), getUserProfile()]);
      setLoading(false);
    }
    loadData();
  }, []);


  const filteredJobs = jobs.filter(
    (job) =>
      job.title.toLowerCase().includes(search.toLowerCase()) ||
      job.location.toLowerCase().includes(search.toLowerCase()) ||
      (job.requiredSkills || "")
        .toLowerCase()
        .includes(search.toLowerCase())
  );

  return (
    <div className="candidate">
      <div className="bg-grid"></div>
      <nav className="candidate__navbar">
        <div className="candidate__logo">
          Smart<span>Hire</span>
        </div>

        <div className="candidate__navRight">
          <Link to="/candidate/my-applications" className="candidate__navBtn">
            My Applications
          </Link>

          <div
            className="candidate__profileWrapper"
            onMouseEnter={() => setShowDropdown(true)}
            onMouseLeave={() => setShowDropdown(false)}
          >
            <div className="candidate__profileIcon">
              {user?.userName?.charAt(0).toUpperCase()}
              <span className="candidate__onlineDot"></span>
            </div>

            <div
              className={`candidate__profileDropdown ${
                showDropdown ? "active" : ""
              }`}
            >
              <div
                className="candidate__dropdownItem"
                onClick={() => navigate("/candidate/profile")}
              >
                My Profile
              </div>

              <div
                className="candidate__dropdownItem logout"
                onClick={handleLogout}
              >
                Logout
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="candidate__hero">
        <h1>Discover Your Next Opportunity</h1>
      </div>

      <div className="candidate__search">
        <input
          type="text"
          placeholder="Search by title, skills, location..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {loading && <p className="candidate__loading">Loading jobs...</p>}

      {!loading && filteredJobs.length === 0 && (
        <div className="candidate__empty">
          No jobs found.
        </div>
      )}

      <div className="candidate__grid">
        {filteredJobs.map((job) => (
          <div className="job-card fade-in" key={job.jobId}>
            <div className="job-card__header">
              <h3>{job.title}</h3>
              <span className="job-card__company">
                {job.companyName}
              </span>
            </div>

            <p className="job-card__location">
              📍 {job.location}
            </p>

            <p className="job-card__desc">
              {job.description.length > 100
                ? job.description.substring(0, 100) + "..."
                : job.description}
            </p>

            <div className="job-card__meta">
              <span>
                {job.experienceMin}–{job.experienceMax} yrs
              </span>
              <span className="job-card__type">
                {job.employmentType}
              </span>
            </div>

            <div className="job-card__skills">
              {job.requiredSkills
                ?.split(",")
                .slice(0, 4)
                .map((skill, index) => (
                  <span key={index}>{skill.trim()}</span>
                ))}
            </div>

            <button
              className="job-card__apply"
              onClick={() => navigate(`/job/${job.jobId}`)}
            >
              View & Apply 
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CandidateLanding;