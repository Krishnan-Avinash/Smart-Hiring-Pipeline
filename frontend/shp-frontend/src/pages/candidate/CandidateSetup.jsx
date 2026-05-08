import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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
      setError("Failed to create candidate profile.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="candidate-setup">
      <h1>Complete Your Candidate Profile</h1>

      <form onSubmit={handleSubmit}>
        <input
          name="resumeUrl"
          placeholder="Resume Link"
          onChange={handleChange}
          required
        />

        <input
          name="education"
          placeholder="Education"
          onChange={handleChange}
          required
        />

        <input
          name="experienceYears"
          type="number"
          placeholder="Experience (Years)"
          onChange={handleChange}
          required
        />

        <textarea
          name="profileSummary"
          placeholder="Profile Summary"
          onChange={handleChange}
          required
        />

        <button type="submit">
          {loading ? "Saving..." : "Save & Continue"}
        </button>

        {error && <p className="error">{error}</p>}
      </form>
    </div>
  );
};

export default CandidateSetup;