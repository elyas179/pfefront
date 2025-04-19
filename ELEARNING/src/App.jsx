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
import StudentHeader from "./StudentHeader"; // Assure-toi de l'importer
import Courses from "./Courses";
const AppContent = () => {
  const location = useLocation();
  const isStudentPage = location.pathname === "/student";
  const isChatPage = location.pathname === "/chat";

  return (
    <>
      {/* Show student header for /student and /chat, otherwise default header */}
      {(isStudentPage || isChatPage) ? <StudentHeader /> : <Header />}

      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/student" element={<Student />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/courses" element={<Courses />} />

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
