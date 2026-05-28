import { Routes, Route } from "react-router-dom";

import Temp from "./Temp";
import ProtectedRoute from "./components/ProtectedRoute";
import RecruiterRoute from "./components/RecruiterRoute";
import CandidateRoute from "./components/CandidateRoute";

import LandingPage from "./pages/LandingPage";
import Register from "./pages/auth/Register";
import Login from "./pages/auth/Login";

import CandidateLanding from "./pages/candidate/CandidateLanding";
import AppliedJobs from "./pages/candidate/AppliedJobs";
import JobDetails from "./pages/candidate/JobDetails";
import CandidateSetup from "./pages/candidate/CandidateSetup";

import RecruiterLanding from "./pages/recruiter/RecruiterLanding";
import RecruiterJobApplicants from "./pages/recruiter/RecruiterJobApplicants";
import RecruiterProfile from "./pages/recruiter/RecruiterProfile";
import CompanySetup from "./pages/recruiter/CompanySetup";
import CandidateProfile from "./pages/candidate/CandidateProfile";

function App() {
  return (
    <Routes>

      {/*  PUBLIC ROUTES  */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/*  PROTECTED ROUTES  */}
      <Route element={<ProtectedRoute />}>

        <Route path="/temp" element={<Temp />} />

        {/*  CANDIDATE ROUTES  */}
        <Route path="/candidate/profile" element={<CandidateProfile />} />

        <Route
          path="/candidate-setup"
          element={<CandidateSetup />}
        />

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

        {/*RECRUITER ROUTES*/}

        <Route
          path="/recruiterLanding"
          element={
            <RecruiterRoute>
              <RecruiterLanding />
            </RecruiterRoute>
          }
        />

        <Route
          path="/recruiter/profile"
          element={<RecruiterProfile />}
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