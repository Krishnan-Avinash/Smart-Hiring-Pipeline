import { Routes, Route } from "react-router-dom";
import Login from "./Login";
import ProtectedRoute from "./components/ProtectedRoute";
import Temp from "./Temp";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/temp" element={<Temp />} />
      </Route>
    </Routes>
  );
}

export default App;
