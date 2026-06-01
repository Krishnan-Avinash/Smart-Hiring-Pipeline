import React, { useState } from "react";
import api from "../../api/axios";
import { useNavigate } from "react-router-dom";
import "../../styles/companySetup.scss";
import { useSnackbar } from "../../context/SnackbarContext";

const CompanySetup = () => {
  const [companyData, setCompanyData] = useState({
    name: "",
    description: "",
    industry: "",
    websiteUrl: "",
  });

  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();

  function handleChange(e) {
    setCompanyData({ ...companyData, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      await api.post("/company/createCompany", companyData, {
        withCredentials: true,
      });

      showSnackbar("Company created successfully");

setTimeout(() => {
  navigate("/recruiterLanding", { replace: true });
}, 1000);

    } catch (err) {
  console.error(err);

  if (![401, 403].includes(err.response?.status)) {
    showSnackbar("Failed to create company");
  }
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