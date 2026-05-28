import React, { useState } from "react";
import api from "../../api/axios";
import { useNavigate } from "react-router-dom";
import "../../styles/companySetup.scss";

const CompanySetup = () => {
  const [companyData, setCompanyData] = useState({
    name: "",
    description: "",
    industry: "",
    websiteUrl: "",
  });

  const navigate = useNavigate();

  function handleChange(e) {
    setCompanyData({ ...companyData, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      await api.post("/company/createCompany", companyData, {
        withCredentials: true,
      });

      navigate("/recruiterLanding", { replace: true });

    } catch (err) {
      console.error(err);
      alert("Company creation failed!");
    }
  }

  return (
    <div className="companySetup">

      <div className="companySetup__wrapper">

        {/* HEADER */}
        <div className="companySetup__header">
          <h1>Setup Company</h1>
          <p>Create your company profile to start posting jobs</p>
        </div>

        {/* CARD */}
        <div className="companySetup__card">
          <form onSubmit={handleSubmit}>

            <div className="inputGroup">
              <label>Company Name</label>
              <input
                type="text"
                name="name"
                placeholder="Enter company name"
                value={companyData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="inputGroup">
              <label>Description</label>
              <textarea
                name="description"
                placeholder="Describe your company..."
                value={companyData.description}
                onChange={handleChange}
                required
              />
            </div>

            <div className="inputGroup">
              <label>Industry</label>
              <input
                type="text"
                name="industry"
                placeholder="IT, Finance, Healthcare..."
                value={companyData.industry}
                onChange={handleChange}
                required
              />
            </div>

            <div className="inputGroup">
              <label>Website</label>
              <input
                type="text"
                name="websiteUrl"
                placeholder="https://yourcompany.com"
                value={companyData.websiteUrl}
                onChange={handleChange}
              />
            </div>

            <button type="submit" className="submitBtn">
              Create Company
            </button>

          </form>
        </div>

      </div>
    </div>
  );
};

export default CompanySetup;