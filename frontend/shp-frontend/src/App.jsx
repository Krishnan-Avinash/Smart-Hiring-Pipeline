import { Routes, Route } from "react-router-dom";
import Temp from "./Temp";
import ProtectedRoute from "./components/ProtectedRoute";
import Register from "./pages/auth/Register";
import Login from "./pages/auth/Login";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/temp" element={<Temp />} />
      </Route>
    </Routes>
  );
}

export default App;
