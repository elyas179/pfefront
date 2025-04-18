import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

import Header from "./Header";
import StudentHeader from "./StudentHeader";
import Footer from "./Footer";
import Home from "./Home";
import Login from "./Login";
import Register from "./Register";
import Student from "./Student";
import Chat from "./Chat";

const AppContent = () => {
  const location = useLocation();
  const isStudentPage = location.pathname === "/student";

  return (
    <>
      {/* Affiche Header global sauf sur /student */}
      {!isStudentPage && <Header />}
      
      {/* Affiche Header spécial uniquement sur /student */}
      {isStudentPage && <StudentHeader />}

      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/student" element={<Student />} />
          <Route path="/chat" element={<Chat />} />
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
