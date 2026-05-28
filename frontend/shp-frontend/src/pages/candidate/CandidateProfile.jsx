import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import { useNavigate } from "react-router-dom";
import "../../styles/candidateProfile.scss";

const CandidateProfile = () => {
  const navigate = useNavigate();

  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);

  const [profile, setProfile] = useState({
    username: "",
    email: "",
    education: "",
    experienceYears: "",
    resumeUrl: "",
    profileSummary: "",
    updatedAt: ""
  });

  const [editingField, setEditingField] = useState(null);
  const [tempValue, setTempValue] = useState("");

  const [snackbar, setSnackbar] = useState("");

  const [passwordData, setPasswordData] = useState({
    password: "",
    confirmPassword: ""
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  async function fetchProfile() {
    try {
      const [userRes, candidateRes] = await Promise.all([
        api.get("/auth/get"),
        api.get("/candidate/getSelf")
      ]);

      setUserId(userRes.data.userId);

      setProfile({
        username: userRes.data.userName,
        email: userRes.data.email,
        education: candidateRes.data.education || "",
        experienceYears: candidateRes.data.experienceYears || "",
        resumeUrl: candidateRes.data.resumeUrl || "",
        profileSummary: candidateRes.data.profileSummary || "",
        updatedAt: candidateRes.data.updatedAt || new Date().toISOString()
      });

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  function handleEdit(field) {
    setEditingField(field);
    setTempValue(profile[field] || "");
  }

  function handleCancel() {
    setEditingField(null);
  }

  async function handleSave(field) {
    try {
      await api.put("/candidate/updateDetails", {
        resumeUrl: field === "resumeUrl" ? tempValue : profile.resumeUrl,
        education: field === "education" ? tempValue : profile.education,
        experienceYears:
          field === "experienceYears"
            ? Number(tempValue)
            : profile.experienceYears,
        profileSummary:
          field === "profileSummary"
            ? tempValue
            : profile.profileSummary
      });

      setProfile(prev => ({
        ...prev,
        [field]: tempValue,
        updatedAt: new Date().toISOString()
      }));

      setEditingField(null);
      showSnackbar("Updated successfully");

    } catch (err) {
      console.error(err);
    }
  }

  async function handlePasswordSave() {
    if (passwordData.password !== passwordData.confirmPassword) {
      showSnackbar("Passwords do not match ❌");
      return;
    }

    try {
      await api.put("/user/updatePassword", {
        userId,
        password: passwordData.password,
        confirmPassword: passwordData.confirmPassword
      });

      setPasswordData({ password: "", confirmPassword: "" });
      showSnackbar("Password updated successfully");

    } catch (err) {
      console.error(err);
    }
  }

  function showSnackbar(message) {
    setSnackbar(message);
    setTimeout(() => setSnackbar(""), 3000);
  }

  async function handleBack() {
  try {
    await api.get("/auth/get"); // check session

    navigate("/candidateLanding");

  } catch (err) {
    navigate("/login");
  }
}


  if (loading) return <div className="profile__loading">Loading...</div>;

  return (
    <div className="profile">

      {/* HEADER */}
      <div className="profile-header">
        <h1>Candidate Profile</h1>
        <button onClick={handleBack}>
          ← Back
        </button>
      </div>

      {/* PROFILE CARD */}
      <div className="profile-card">
        <div className="left">
          <div className="avatar">
            {profile.username?.charAt(0).toUpperCase()}
          </div>

          <h2>{profile.username}</h2>
          <p>{profile.email}</p>
        </div>

        <div className="right">
          <p className="updated">
            Last updated: {new Date(profile.updatedAt).toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* DETAILS */}
      <div className="details">
        <h3>Profile Details</h3>

        <div className="grid">
          {["education", "experienceYears", "resumeUrl", "profileSummary"].map(field => (
            <div className="field-card" key={field}>

              <label>{field.replace(/([A-Z])/g, " $1")}</label>

              {editingField === field ? (
                <>
                  <input
                    value={tempValue}
                    onChange={(e) => setTempValue(e.target.value)}
                  />

                  <div className="actions">
                    <button className="save" onClick={() => handleSave(field)}>Save</button>
                    <button className="cancel" onClick={handleCancel}>Cancel</button>
                  </div>
                </>
              ) : (
                <>
                  <div className="value">
                    {field === "resumeUrl" && profile[field] ? (
                      <a
                        href={
                          profile[field].startsWith("http")
                            ? profile[field]
                            : `https://${profile[field]}`
                        }
                        target="_blank"
                        rel="noreferrer"
                      >
                        View Resume
                      </a>
                    ) : (
                      profile[field] || "Not provided"
                    )}
                  </div>

                  <button
                    className="edit"
                    onClick={() => handleEdit(field)}
                  >
                    Edit
                  </button>
                </>
              )}

            </div>
          ))}
        </div>

        {/* PASSWORD */}
        <div className="password-section">
          <h4>Change Password</h4>

          <input
            type="password"
            placeholder="New Password"
            value={passwordData.password}
            onChange={(e) =>
              setPasswordData({ ...passwordData, password: e.target.value })
            }
          />

          <input
            type="password"
            placeholder="Confirm Password"
            value={passwordData.confirmPassword}
            onChange={(e) =>
              setPasswordData({
                ...passwordData,
                confirmPassword: e.target.value
              })
            }
          />

          <button onClick={handlePasswordSave}>
            Update Password
          </button>
        </div>

      </div>

      {/* SNACKBAR */}
      {snackbar && (
        <div className="snackbar">{snackbar}</div>
      )}

    </div>
  );
};

export default CandidateProfile;