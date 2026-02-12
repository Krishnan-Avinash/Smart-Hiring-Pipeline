import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import { Link, useNavigate } from "react-router-dom";
import "../../styles/candidateLanding.scss";


const CandidateLanding = () => {
  const [jobs, setJobs] = useState([]);
  const [user, setUser] = useState(null);
  const [search, setSearch] = useState("");

  const navigate = useNavigate();

  // ✅ Fetch Jobs
  async function getJobs() {
    try {
      const res = await api.get("/jobs/getAllJobs");
      setJobs(res.data);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    }
  }

  // ✅ Fetch Logged-in Candidate Username
  async function getUserProfile() {
    try {
      const res = await api.get("/auth/get"); 
      setUser(res.data); 
    } catch (err) {
      console.error("Error fetching user profile:", err);
    }
  }

  // ✅ Logout Function
  async function handleLogout() {
    try {
      await api.post("/auth/logout");
      navigate("/");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  }

  useEffect(() => {
    getJobs();
    getUserProfile();
  }, []);

  const filteredJobs = jobs.filter((job) =>
  job.title.toLowerCase().includes(search.toLowerCase()) ||
  job.location.toLowerCase().includes(search.toLowerCase()) ||
  job.requiredSkills.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="candidate">

      {/* ✅ Navbar */}
      <nav className="candidate__navbar">
        <div className="candidate__logo">
          Smart<span>Hire</span>
        </div>

        <div className="candidate__navRight">
          {/* ✅ Username */}
          {user && (
            <p className="candidate__username">
              Welcome, <span>{user.userName}</span>
            </p>
          )}

          {/* Applications Button */}
          <Link to="/applied" className="candidate__navBtn">
            My Applications
          </Link>

          {/* Logout Button */}
          <button onClick={handleLogout} className="candidate__logoutBtn">
            Logout
          </button>
        </div>
      </nav>

      {/* Page Title */}
      <div className="candidate__header">
        <h1>Explore Available Jobs</h1>
        <p>Apply to jobs that match your skills and experience.</p>
      </div>

      {/* Search Bar */}
      <div className="candidate__search">
        <input type="text" placeholder="Search jobs by title, skills, or location..." value={search}
        onChange={(e) => setSearch(e.target.value)}/>
        </div>

      {/* Jobs Grid */}
      <div className="candidate__grid">
        {filteredJobs?.map((job) => (
          <div className="job-card" key={job.jobId}>
            <div className="job-card__header">
              <h3>{job.title}</h3>
              <span className="job-card__company">
                {job.companyName}
              </span>
            </div>

            <p className="job-card__location">📍 {job.location}</p>

            <p className="job-card__desc">
              {job.description.length > 90
                ? job.description.substring(0, 90) + "..."
                : job.description}
            </p>

            <div className="job-card__meta">
              <span>
                Experience: {job.experienceMin}–{job.experienceMax} yrs
              </span>
              <span className="job-card__type">{job.employmentType}</span>
            </div>

            {/* Skills */}
            <div className="job-card__skills">
              {job.requiredSkills
                ?.split(",")
                .slice(0, 4)
                .map((skill, index) => (
                  <span key={index}>{skill.trim()}</span>
                ))}
            </div>

            {/* Apply Button */}
            <button className="job-card__apply"
              onClick={() => navigate(`/job/${job.jobId}`)}>
              Apply Now 🚀
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CandidateLanding;