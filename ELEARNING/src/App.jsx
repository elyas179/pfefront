// File: App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

import Header from "./Header";
import Footer from "./Footer";
import Home from "./Home";
import Login from "./Login";
import Register from "./Register";
import Student from "./Student";
import Chat from "./Chat";
import Courses from "./Courses";
import MyModules from "./MyModules";
import StudentHeader from "./StudentHeader";

const AppContent = () => {
  const location = useLocation();

  // ✅ Liste des routes qui utilisent le header spécial étudiant
  const studentRoutes = ["/student", "/chat", "/courses", "/my-modules"];
  const isStudentHeader = studentRoutes.includes(location.pathname);

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
