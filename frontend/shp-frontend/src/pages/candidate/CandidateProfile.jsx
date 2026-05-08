import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import { useNavigate } from "react-router-dom";
import "../../styles/candidateProfile.scss";

const CandidateProfile = () => {
  const navigate = useNavigate();

  const [userId, setUserId] = useState(null);

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
  const [loading, setLoading] = useState(true);
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
        api.get("/auth/get", { withCredentials: true }),
        api.get("/candidate/getSelf", { withCredentials: true })
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
      await api.put(
        "/candidate/updateDetails",
        {
          resumeUrl:
            field === "resumeUrl" ? tempValue : profile.resumeUrl,
          education:
            field === "education" ? tempValue : profile.education,
          experienceYears:
            field === "experienceYears"
              ? tempValue
              : profile.experienceYears,
          profileSummary:
            field === "profileSummary"
              ? tempValue
              : profile.profileSummary
        },
        { withCredentials: true }
      );

      setProfile((prev) => ({
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
      alert("Passwords do not match");
      return;
    }

    try {
      await api.put(
        "/user/updatePassword",
        {
          userId: userId,
          password: passwordData.password,
          confirmPassword: passwordData.confirmPassword
        },
        { withCredentials: true }
      );

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

  if (loading) return <div className="profile__loading">Loading...</div>;

  return (
    <div className="profile">
      <div className="profile__wrapper">

        <div className="profile__header">
          <div>
            <h2>
              Hello, <span>{profile.username}</span>
            </h2>
            <p>
              Last Updated:{" "}
              {new Date(profile.updatedAt).toLocaleDateString()}
            </p>
          </div>

          <button onClick={async () => {
            try {await api.get("/auth/get", { withCredentials: true });
            navigate("/candidateLanding");
        } 
        catch (err) {
            navigate("/");
        }
        }}
>
  Back to Jobs
</button>
        </div>

        <div className="profile__container">

          {["username", "email", "education", "experienceYears", "resumeUrl", "profileSummary"]
            .map((field) => (
              <div key={field} className="profile__row">

                <div className="profile__left">
                  <h4>
                    {field.replace(/([A-Z])/g, " $1").toUpperCase()}
                  </h4>

                  {editingField === field ? (
                    <input
                      value={tempValue}
                      onChange={(e) =>
                        setTempValue(e.target.value)
                      }
                    />
                  ) : (
                    <div className="profile__valueBox">
                      {profile[field] || "Not Provided"}
                    </div>
                  )}
                </div>

                <div className="profile__right">
                  {editingField === field ? (
                    <div className="buttonGroup">
                      <button
                        className="saveBtn"
                        onClick={() => handleSave(field)}
                      >
                        Save
                      </button>

                      <button
                        className="cancelBtn"
                        onClick={handleCancel}
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    field !== "username" &&
                    field !== "email" && (
                      <button
                        className="editBtn"
                        onClick={() => handleEdit(field)}
                      >
                        Edit
                      </button>
                    )
                  )}
                </div>

              </div>
            ))}

          <div className="profile__divider" />

          <div className="profile__password">
            <h4>CHANGE PASSWORD</h4>

            <input
              type="password"
              placeholder="New Password"
              value={passwordData.password}
              onChange={(e) =>
                setPasswordData({
                  ...passwordData,
                  password: e.target.value
                })
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

        {snackbar && (
          <div className="profile__snackbar">
            {snackbar}
          </div>
        )}

      </div>
    </div>
  );
};

export default CandidateProfile;