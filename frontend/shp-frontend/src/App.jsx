import { Routes, Route } from "react-router-dom";

import Temp from "./Temp";
import ProtectedRoute from "./components/ProtectedRoute";
import RecruiterRoute from "./components/RecruiterRoute";
import CandidateRoute from "./components/CandidateRoute";

import Register from "./pages/auth/Register";
import Login from "./pages/auth/Login";

import CandidateLanding from "./pages/candidate/CandidateLanding";
import AppliedJobs from "./pages/candidate/AppliedJobs";
import JobDetails from "./pages/candidate/JobDetails";
import CandidateSetup from "./pages/candidate/CandidateSetup";

import RecruiterLanding from "./pages/recruiter/RecruiterLanding";
import RecruiterJobApplicants from "./pages/recruiter/RecruiterJobApplicants";
import CompanySetup from "./pages/recruiter/CompanySetup";
import CandidateProfile from "./pages/candidate/CandidateProfile";

function App() {
  return (
    <Routes>

      {/* ================= PUBLIC ROUTES ================= */}
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* ================= PROTECTED ROUTES ================= */}
      <Route element={<ProtectedRoute />}>

        <Route path="/temp" element={<Temp />} />

        {/* ================= CANDIDATE ROUTES ================= */}
        <Route path="/candidate/profile" element={<CandidateProfile />} />

        {/* 🔥 Setup Page (NOT wrapped to avoid redirect loop) */}
        <Route
          path="/candidate-setup"
          element={<CandidateSetup />}
        />

        {/* Wrapped pages (require candidate profile) */}
        <Route
          path="/candidateLanding"
          element={
            <CandidateRoute>
              <CandidateLanding />
            </CandidateRoute>
          }
        />

        <Route
          path="/candidate/my-applications"
          element={
            <CandidateRoute>
              <AppliedJobs />
            </CandidateRoute>
          }
        />

        <Route
          path="/job/:jobId"
          element={
            <CandidateRoute>
              <JobDetails />
            </CandidateRoute>
          }
        />

        {/* ================= RECRUITER ROUTES ================= */}

        <Route
          path="/recruiterLanding"
          element={
            <RecruiterRoute>
              <RecruiterLanding />
            </RecruiterRoute>
          }
        />

        <Route
          path="/recruiter/job/:jobId"
          element={<RecruiterJobApplicants />}
        />

        <Route
  path="/company-setup"
  element={<CompanySetup />}
/>

      </Route>
    </Routes>
  );
}

export default App;