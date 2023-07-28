import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "./components/pages/Register";
import Login from "./components/pages/Login";
import Project from "./components/pages/Project";
import Dashboard from "./components/pages/Dashboard";
import VideoDownloadPage from "./components/pages/VideoDownloadPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Dashboard />} />
        <Route path="/project/:projectId" element={<Project />} />
        <Route path="/video/:projectId" element={<VideoDownloadPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
