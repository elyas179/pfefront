// File: App.jsx
import { AnimatePresence } from "framer-motion";
import React from "react";
import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";

import Chat from "./Chat";
import Courses from "./Courses";
import Footer from "./Footer";
import Header from "./Header";
import Home from "./Home";
import Login from "./Login";
import MyModules from "./MyModules";
import Notification from "./PAGES/Notification";
import Register from "./Register";
import Student from "./Student";
import StudentHeader from "./StudentHeader";
import StudentSettings from "./StudentSettings"; // ou le chemin exact
import StudentSettingsEdit from "./StudentSettingsEdit"; 
import StudentFAQ from "./StudentFAQ";
import ModuleDetail from "./ModuleDetail"; 
import TeacherDashboard from './PAGES/TeacherDashboard';

const AppContent = () => {
  const location = useLocation();

  // ✅ Liste des routes qui utilisent le header spécial étudiant
  const isStudentHeader =
    location.pathname.startsWith("/student") ||
    location.pathname.startsWith("/chat") ||
    location.pathname.startsWith("/courses") ||
    location.pathname.startsWith("/my-modules") ||
    location.pathname.startsWith("/studentsettings") ||
    location.pathname.startsWith("/faq") ||
    location.pathname.startsWith("/modules/");

  return (
    <>
      {isStudentHeader ? <StudentHeader /> : <Header />}

      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/student" element={<Student />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/my-modules" element={<MyModules />} />

          <Route path="/notification" element={<Notification />} />

          <Route path="/studentsettings" element={<StudentSettings />} />
          <Route path="/studentsettings/edit" element={<StudentSettingsEdit />} />
          <Route path="/faq" element={<StudentFAQ />} />
          <Route path="/modules/:id" element={<ModuleDetail />} />
          <Route path="/teacher" element={<TeacherDashboard />} />
        </Routes>
      </AnimatePresence>

      <Footer />
    </>
  );
};

const App = () => (
  <Router>
    <AppContent />
  </Router>
);

export default App;
