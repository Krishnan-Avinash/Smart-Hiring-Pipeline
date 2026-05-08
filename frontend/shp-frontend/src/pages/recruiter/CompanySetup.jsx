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
      await api.post("/company/createCompany", companyData, { withCredentials: true });
      alert("Company Created Successfully!");

      
      navigate("/recruiterLanding", { replace: true });
    } catch (err) {
      console.error(err);
      alert("Company creation failed!");
    }
  }

// useEffect(() => {
//   let isMounted = true;

//   async function checkIfCompanyExists() {
//     try {
//       const res = await api.get("/recruiter/getSelf", {
//         withCredentials: true,
//       });

//       if (!isMounted) return;

//       // If recruiter already has company → redirect once
//       if (res.data.companyId) {
//         navigate("/recruiterLanding", { replace: true });
//       }

//     } catch (err) {
//       if (!isMounted) return;
//       navigate("/", { replace: true });
//     }
//   }

//   checkIfCompanyExists();

//   return () => {
//     isMounted = false;
//   };
// }, [navigate]);

return (
  <div className="companySetup">
    <div className="companySetup__card">
      <h1>Setup Your Company Profile</h1>
      <p>You must create a company before posting jobs.</p>

      <form onSubmit={handleSubmit}>


        <input
          type="text"
          name="name"
          placeholder="Company Name"
          value={companyData.name}
          onChange={handleChange}
          required
        />

        <textarea
          name="description"
          placeholder="Company Description"
          value={companyData.description}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="industry"
          placeholder="Industry (IT, Finance...)"
          value={companyData.industry}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="websiteUrl"
          placeholder="Website URL"
          value={companyData.websiteUrl}
          onChange={handleChange}
        />

        <button type="submit">Save Company</button>
      </form>
    </div>
  </div>
);
};

export default CompanySetup;