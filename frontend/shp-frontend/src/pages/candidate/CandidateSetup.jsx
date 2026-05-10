import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import api from "../../api/axios";
import "../../styles/candidateSetup.scss";

const CandidateSetup = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    resumeUrl: "",
    education: "",
    experienceYears: "",
    profileSummary: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    try {
      setLoading(true);

      await api.post("/candidate/createCandidate", {
        resumeUrl: form.resumeUrl,
        education: form.education,
        experienceYears: Number(form.experienceYears),
        profileSummary: form.profileSummary,
      });

      navigate("/candidateLanding");
    } catch (err) {
      setError("Failed to create profile");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="candidate-setup">
      {/* background */}
      <div className="bg-grid"></div>
      <div className="glow glow-1"></div>
      <div className="glow glow-2"></div>

      <motion.div
        className="setup-card"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1>Build your profile</h1>
        <p>Let AI match you with the best opportunities</p>

        <form onSubmit={handleSubmit}>
          <div className="field">
            <input
              name="resumeUrl"
              placeholder="Resume Link"
              onChange={handleChange}
              required
            />
          </div>

          <div className="field">
            <input
              name="education"
              placeholder="Education (e.g. B.Tech CSE)"
              onChange={handleChange}
              required
            />
          </div>

          <div className="field">
            <input
              name="experienceYears"
              type="number"
              placeholder="Experience (Years)"
              onChange={handleChange}
              required
            />
          </div>

          <div className="field">
            <textarea
              name="profileSummary"
              placeholder="Tell us about yourself..."
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="primary">
            {loading ? "Saving..." : "Save & Continue"}
          </button>

          {error && <p className="error">{error}</p>}
        </form>
      </motion.div>
    </div>
  );
};

export default CandidateSetup;