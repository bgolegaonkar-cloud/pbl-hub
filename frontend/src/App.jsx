import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProjectList from "./pages/ProjectList";
import ProjectDetails from "./pages/ProjectDetails";
import Workspace from "./pages/Workspace";
import Dashboard from "./pages/Dashboard";
import TaskBoard from "./pages/TaskBoard";
import CalendarPage from "./pages/CalendarPage";
import Reports from "./pages/Reports";
import ProfilePage from "./pages/ProfilePage";


function App() {
  return (
    <div>
      <Navbar />
      <div className="container mx-auto p-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/projects" element={<ProjectList />} />
          <Route path="/projects/:id" element={<ProjectDetails />} />
          <Route path="/workspace/:id" element={<Workspace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/taskboard/:projectId" element={<TaskBoard />} />
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/profile" element={<ProfilePage />} />

        </Routes>
      </div>
    </div>
  );
}

export default App;
