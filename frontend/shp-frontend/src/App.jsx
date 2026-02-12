import { Routes, Route } from "react-router-dom";
import Temp from "./Temp";
import ProtectedRoute from "./components/ProtectedRoute";
import Register from "./pages/auth/Register";
import Login from "./pages/auth/Login";
import CandidateLanding from "./pages/candidate/CandidateLanding";
import AppliedJobs from "./pages/candidate/AppliedJobs";
import RecruiterLanding from "./pages/recruiter/RecruiterLanding";
import JobDetails from "./pages/candidate/JobDetails";


function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/temp" element={<Temp />} />
        <Route path="/candidateLanding" element={<CandidateLanding />} />
        <Route path="/applied" element={<AppliedJobs />} />
        <Route path="/recruiterLanding" element={<RecruiterLanding />} />
        <Route path="/job/:jobId" element={<JobDetails />} />
      </Route>
    </Routes>
  );
}

export default App;
