import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import "../../styles/recruiterProfile.scss";
import { useNavigate } from "react-router-dom";
import { Snackbar, Alert } from "@mui/material";

const RecruiterProfile = () => {
  const [user, setUser] = useState(null);
  const [recruiter, setRecruiter] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [editMode, setEditMode] = useState(false);

  const [selectedJobs, setSelectedJobs] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState("");

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success"
  });

  const navigate = useNavigate();

  const showSnackbar = (msg, type = "success") => {
    setSnackbar({ open: true, message: msg, severity: type });
  };

  const [formData, setFormData] = useState({
    designation: "",
    email: "",
    companyName: "",
    industry: "",
    websiteUrl: "",
    description: ""
  });

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      const userRes = await api.get("/auth/get");
      setUser(userRes.data);

      const recRes = await api.get("/recruiter/getSelf");
      let recruiterData = recRes.data;

      if (recruiterData.companyId) {
        const companyRes = await api.get(
          `/company/getCompanyById/${recruiterData.companyId}`
        );

        recruiterData = {
          ...recruiterData,
          company: companyRes.data
        };
      }

      setRecruiter(recruiterData);

      setFormData({
        designation: recruiterData.designation || "",
        email: recruiterData.email || "",
        companyName: recruiterData.company?.name || "",
        industry: recruiterData.company?.industry || "",
        websiteUrl: recruiterData.company?.websiteUrl || "",
        description: recruiterData.company?.description || ""
      });

      const jobRes = await api.get("/jobs/getJobsOfARecruiter");
      setJobs(jobRes.data);

    } catch (err) {
      console.error(err);
    }
  }

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  async function handleUpdate() {
    try {
      await api.put("/recruiter/updateSelf", {
        designation: formData.designation,
        email: formData.email
      });

      if (recruiter?.company?.companyId) {
        await api.put(
          `/company/updateCompany/${recruiter.company.companyId}`,
          {
            name: formData.companyName,
            industry: formData.industry,
            websiteUrl: formData.websiteUrl,
            description: formData.description
          }
        );
      }

      showSnackbar("Profile updated successfully!");
      setEditMode(false);
      fetchData();

    } catch (err) {
      console.error(err);
      showSnackbar("Update failed ❌", "error");
    }
  }

  function handleBack() {
  navigate("/recruiterLanding");
}

  function handleJobClick(jobId) {
    setShowModal(false);
    navigate(`/recruiter/job/${jobId}`);
  }

  const activeJobs = jobs.filter(j => j.status === "OPEN").length;
  const closedJobs = jobs.filter(j => j.status === "CLOSED").length;

  const completionScore = [
    recruiter?.designation,
    recruiter?.email,
    recruiter?.company?.name,
    recruiter?.company?.industry,
    recruiter?.company?.websiteUrl,
    recruiter?.company?.description,
    jobs.length >= 1,
    jobs.length >= 2,
    jobs.length >= 3,
    jobs.length >= 5,
    jobs.length >= 7,
    jobs.length >= 10,
    activeJobs >= 1,
    activeJobs >= 3
  ];

  const completion = Math.round(
    (completionScore.filter(Boolean).length / completionScore.length) * 100
  );

  const getProfileStatus = () => {
    if (completion < 30) return "Getting Started";
    if (completion < 50) return "Profile Setup";
    if (completion < 65) return "Ready to Hire";
    if (completion < 80) return "Hiring in Progress";
    if (completion < 95) return "Actively Hiring";
    return "Established Recruiter";
  };

  return (
    <div className="recruiterProfile">

      {/* HEADER */}
      <div className="profile-header">
        <h1>Recruiter Profile</h1>
        <button onClick={handleBack}>
          ← Back
        </button>
      </div>

      {/* PROFILE CARD */}
      <div className="profile-card">
        <div className="left">
          <div className="avatar">
            {user?.userName?.charAt(0).toUpperCase()}
          </div>

          <h2>{user?.userName}</h2>
          <p>{user?.email}</p>
          <span className="role">{user?.role}</span>
        </div>

        <div className="right">
          <button onClick={() => setEditMode(!editMode)}>
            {editMode ? "Cancel" : "Edit Profile"}
          </button>
        </div>
      </div>

      {/* COMPLETION */}
      <div className="completion">
        <p>
          Profile Completion ({completion}%) — {getProfileStatus()}
        </p>
        <div className="bar">
          <div style={{ width: `${completion}%` }}></div>
        </div>
      </div>

      {/* DETAILS */}
      <div className="details">
        <h3>Professional Details</h3>

        {editMode ? (
          <>
            <h4>Recruiter</h4>
            <input name="designation" value={formData.designation} onChange={handleChange} />
            <input name="email" value={formData.email} onChange={handleChange} />

            <h4>Company</h4>
            <input name="companyName" value={formData.companyName} onChange={handleChange} />
            <input name="industry" value={formData.industry} onChange={handleChange} />
            <input name="websiteUrl" value={formData.websiteUrl} onChange={handleChange} />
            <textarea name="description" value={formData.description} onChange={handleChange} />

            <button onClick={handleUpdate}>Save</button>
          </>
        ) : (
          <div className="grid">
            <p><b>Designation:</b> {recruiter?.designation || "Not set"}</p>
            <p><b>Email:</b> {recruiter?.email || "Not set"}</p>
            <p><b>Company:</b> {recruiter?.company?.name || "Not set"}</p>
            <p><b>Industry:</b> {recruiter?.company?.industry || "Not set"}</p>
            <p><b>Description:</b> {recruiter?.company?.description || "Not set"}</p>

            <p>
              <b>Website:</b>{" "}
              {recruiter?.company?.websiteUrl ? (
                <a
                  href={
                    recruiter.company.websiteUrl.startsWith("http")
                      ? recruiter.company.websiteUrl
                      : `https://${recruiter.company.websiteUrl}`
                  }
                  target="_blank"
                  rel="noreferrer"
                >
                  Visit Website
                </a>
              ) : "Not set"}
            </p>
          </div>
        )}
      </div>

      {/* STATS */}
      <div className="stats">
        <div className="stat-box clickable" onClick={() => {
          setSelectedJobs(jobs);
          setModalTitle("All Jobs");
          setShowModal(true);
        }}>
          <h4>Total Jobs</h4>
          <p>{jobs.length}</p>
        </div>

        <div className="stat-box clickable" onClick={() => {
          setSelectedJobs(jobs.filter(j => j.status === "OPEN"));
          setModalTitle("Active Jobs");
          setShowModal(true);
        }}>
          <h4>Active Jobs</h4>
          <p>{activeJobs}</p>
        </div>

        <div className="stat-box clickable" onClick={() => {
          setSelectedJobs(jobs.filter(j => j.status === "CLOSED"));
          setModalTitle("Closed Jobs");
          setShowModal(true);
        }}>
          <h4>Closed Jobs</h4>
          <p>{closedJobs}</p>
        </div>
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="job-modal">
          <div className="modal-content">

            <div className="modal-header">
              <h3>{modalTitle}</h3>
              <button onClick={() => setShowModal(false)}>✕</button>
            </div>

            <div className="modal-list">
              {selectedJobs.length === 0 ? (
                <p>No jobs found</p>
              ) : (
                selectedJobs.map(job => (
                  <div
                    className="job-item clickable"
                    key={job.jobId}
                    onClick={() => handleJobClick(job.jobId)}
                  >
                    <h4>{job.title}</h4>
                    <p>{job.location}</p>
                    <span className={`status ${job.status.toLowerCase()}`}>
                      {job.status}
                    </span>
                  </div>
                ))
              )}
            </div>

          </div>
        </div>
      )}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity} variant="filled">
          {snackbar.message}
        </Alert>
      </Snackbar>

    </div>
  );
};

export default RecruiterProfile;