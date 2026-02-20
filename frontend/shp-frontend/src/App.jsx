import { Routes, Route } from "react-router-dom";

import Temp from "./Temp";
import ProtectedRoute from "./components/ProtectedRoute";

import Register from "./pages/auth/Register";
import Login from "./pages/auth/Login";

import CandidateLanding from "./pages/candidate/CandidateLanding";
import AppliedJobs from "./pages/candidate/AppliedJobs";
import JobDetails from "./pages/candidate/JobDetails";

import RecruiterLanding from "./pages/recruiter/RecruiterLanding";
import RecruiterJobApplicants from "./pages/recruiter/RecruiterJobApplicants";
import CompanySetup from "./pages/recruiter/CompanySetup";

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/temp" element={<Temp />} />

        {/* Candidate Routes */}
        <Route path="/candidateLanding" element={<CandidateLanding />} />
        <Route path="/applied" element={<AppliedJobs />} />
        <Route path="/job/:jobId" element={<JobDetails />} />

        {/* Recruiter Routes */}
        <Route path="/recruiterLanding" element={<RecruiterLanding />} />
        <Route
          path="/recruiter/job/:jobId"
          element={<RecruiterJobApplicants />}
        />

        {/* Company Setup Route */}
        <Route path="/company-setup" element={<CompanySetup />} />
      </Route>
    </Routes>
  );
}

export default App;