// File: App.jsx
/*import { AnimatePresence } from "framer-motion";
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
import StudentQuizzes from "./StudentQuizzes"; 
import StudentPerformance from "./StudentPerformance";
import StudentProfessors from './StudentProfessors';
import ResourceDetail from './ResourceDetail';
import UserProfile from "./UserProfile";
import StudentQuizPlay from "./StudentQuizPlay";
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
  location.pathname.startsWith("/modules/") ||
  location.pathname.startsWith("/quizes") ||
  location.pathname.startsWith("/quiz/") ||
  location.pathname.startsWith("/notification") ||
  location.pathname.startsWith("/profile") ||
  location.pathname.startsWith("/performance");
  location.pathname.startsWith("/StudentProfessors");


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

          <Route path="/quiz/:id" element={<StudentQuizPlay />} />

          <Route path="/notification" element={<Notification />} />
          <Route path="/StudentProfessors" element={<StudentProfessors />} />
          <Route path="/studentsettings" element={<StudentSettings />} />
          <Route path="/studentsettings/edit" element={<StudentSettingsEdit />} />
          <Route path="/faq" element={<StudentFAQ />} />
          <Route path="/modules/:id" element={<ModuleDetail />} />
          <Route path="/teacher" element={<TeacherDashboard />} />
          <Route path="/quizes" element={<StudentQuizzes />} />
          <Route path="/performance" element={<StudentPerformance />} />

          
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

export default App;*/
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
import StudentSettings from "./StudentSettings";
import StudentSettingsEdit from "./StudentSettingsEdit";
import StudentFAQ from "./StudentFAQ";
import ModuleDetail from "./ModuleDetail";
import TeacherDashboard from './PAGES/TeacherDashboard';
import StudentQuizzes from "./StudentQuizzes";
import StudentPerformance from "./StudentPerformance";
import StudentProfessors from "./StudentProfessors";

import TeacherCourses from "./PAGES/TeacherCourses";
import AddCourse from "./PAGES/AddCourse";
import TeacherResources from "./PAGES/TeacherResources";
import TeacherStudents from "./PAGES/TeacherStudents";

import ResourceDetail from './ResourceDetail';

import UserProfile from "./UserProfile";
import StudentQuizPlay from "./StudentQuizPlay";

// Nouveaux imports pour le professeur
import CreateQuiz from "./PAGES/CreateQuiz";
import AccessRequests from "./PAGES/AccessRequests";
import TeacherSettings from "./PAGES/TeacherSettings";
import TeacherChat from "./PAGES/TeacherChat";
import TeacherFAQ from "./PAGES/TeacherFAQ";

const AppContent = () => {
  const location = useLocation();


  const isStudentHeader = (
    location.pathname.startsWith("/student") ||
    location.pathname.startsWith("/chat") ||
    location.pathname.startsWith("/courses") ||
    location.pathname.startsWith("/my-modules") ||
    location.pathname.startsWith("/studentsettings") ||
    location.pathname.startsWith("/faq") ||
    location.pathname.startsWith("/modules/") ||
    location.pathname.startsWith("/quizes") ||
    location.pathname.startsWith("/performance") ||  // ✅ ici
    location.pathname.startsWith("/StudentProfessors")
  );

  const isTeacherHeader = (
    location.pathname.startsWith("/teachercourses") ||
    location.pathname.startsWith("/addcourse") ||
    location.pathname.startsWith("/teacherresources") ||
    location.pathname.startsWith("/teacherstudents") ||
    location.pathname.startsWith("/createquiz") ||
    location.pathname.startsWith("/accessrequests") ||
    location.pathname.startsWith("/teachersettings") ||
    location.pathname.startsWith("/teacherchat") ||
    location.pathname.startsWith("/teacherfaq")
  );


  return (
    <>
      {isStudentHeader ? <StudentHeader /> : <Header />}

      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          {/* Routes pour tout le monde */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Routes étudiant */}
          <Route path="/student" element={<Student />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/my-modules" element={<MyModules />} />
          <Route path="/notification" element={<Notification />} />
          <Route path="/StudentProfessors" element={<StudentProfessors />} />
          <Route path="/studentsettings" element={<StudentSettings />} />
          <Route path="/studentsettings/edit" element={<StudentSettingsEdit />} />
          <Route path="/faq" element={<StudentFAQ />} />
          <Route path="/modules/:id" element={<ModuleDetail />} />
          <Route path="/quizes" element={<StudentQuizzes />} />
          <Route path="/performance" element={<StudentPerformance />} />

          {/* Routes professeur */}
          <Route path="/teacher" element={<TeacherDashboard />} />
          <Route path="/create-quiz" element={<CreateQuiz />} />
          <Route path="/access-requests" element={<AccessRequests />} />
          <Route path="/teacher-settings" element={<TeacherSettings />} />
          <Route path="/teacher-chat" element={<TeacherChat />} />
          <Route path="/teacher-faq" element={<TeacherFAQ />} />
          <Route path="/teacher-courses" element={<TeacherCourses />} />
          <Route path="/add-course" element={<AddCourse />} />
          <Route path="/teacher-resources" element={<TeacherResources />} />
          <Route path="/teacher-students" element={<TeacherStudents />} />
          
          <Route path="/resources/:id" element={<ResourceDetail />} />

          <Route path="/profile/:id" element={<UserProfile />} />

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
