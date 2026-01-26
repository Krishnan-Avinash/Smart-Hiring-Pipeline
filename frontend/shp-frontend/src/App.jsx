import { Routes, Route } from "react-router-dom";
import Temp from "./Temp";
import ProtectedRoute from "./components/ProtectedRoute";
import Register from "./pages/auth/Register";
import Login from "./pages/auth/Login";
import CandidateLanding from "./pages/candidate/CandidateLanding";
import AppliedJobs from "./pages/candidate/AppliedJobs";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/temp" element={<Temp />} />
        <Route path="/candidateLanding" element={<CandidateLanding />} />
        <Route path="/applied" element={<AppliedJobs />} />
      </Route>
    </Routes>
  );
}

export default App;
