import { AnimatePresence } from "framer-motion";
import React from "react";
import { BrowserRouter as Router, Route, Routes, useLocation, Navigate } from "react-router-dom";

import EditProfile from "./EditProfile";
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
import CreateQuiz from "./PAGES/CreateQuiz";
import AccessRequests from "./PAGES/AccessRequests";
import TeacherSettings from "./PAGES/TeacherSettings";
import TeacherChat from "./PAGES/TeacherChat";
import TeacherFAQ from "./PAGES/TeacherFAQ";
import TeacherHeader from "./TeacherHeader";
import ModulesPage from "./PAGES/ModulesPage";
import ChaptersPage from "./PAGES/ChaptersPage";
import ResourcesPage from "./PAGES/ResourcesPage";
import Program from "./Program";
import AnnouncementsPage from './PAGES/AnnouncementsPage';

// ✅ New quiz components
import GenQuiz from "./GenQuiz";
import PlayQuiz from "./PlayQuiz";

const isAuthenticated = () => {
  const token = localStorage.getItem("accessToken");
  return !!token;
};

const PrivateRoute = ({ element }) => {
  return isAuthenticated() ? element : <Navigate to="/login" replace />;
};

const AppContent = () => {
  const location = useLocation();

 
  const isStudentHeader = [
    "/student", "/chat", "/courses", "/my-modules", "/studentsettings",
    "/faq", "/modules/", "/quizes", "/quiz/", "/performance", "/profile",
    "/StudentProfessors", "/Program" ,"/quizzes/gen" , "/quizzes/play"
  ].some(path => location.pathname.startsWith(path));

  const isTeacherHeader = (
    location.pathname.startsWith("/teacher") ||
    location.pathname.startsWith("/create-quiz") ||
    location.pathname.startsWith("/access-requests") ||
    location.pathname.startsWith("/teacher-settings") ||
    location.pathname.startsWith("/teacher-chat") ||
    location.pathname.startsWith("/teacher-faq") ||
    location.pathname.startsWith("/teacher-courses") ||
    location.pathname.startsWith("/add-course") ||
    location.pathname.startsWith("/teacher-resources") ||
    location.pathname.startsWith("/teacher-students")
  );

  return (
    <div className="app-container">
      {
        isStudentHeader ? <StudentHeader />
        : isTeacherHeader ? <TeacherHeader />
        : <Header />
      }

      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          {/* Public */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Student */}
          <Route path="/student" element={<PrivateRoute element={<Student />} />} />
          <Route path="/announcements" element={<PrivateRoute element={<AnnouncementsPage />} />} />
          <Route path="/chat" element={<PrivateRoute element={<Chat />} />} />
          <Route path="/courses" element={<PrivateRoute element={<Courses />} />} />
          <Route path="/my-modules" element={<PrivateRoute element={<MyModules />} />} />
          <Route path="/notification" element={<PrivateRoute element={<Notification />} />} />
          <Route path="/StudentProfessors" element={<PrivateRoute element={<StudentProfessors />} />} />
          <Route path="/studentsettings" element={<PrivateRoute element={<StudentSettings />} />} />
          <Route path="/studentsettings/edit" element={<PrivateRoute element={<StudentSettingsEdit />} />} />
          <Route path="/faq" element={<PrivateRoute element={<StudentFAQ />} />} />
          <Route path="/modules/:id" element={<PrivateRoute element={<ModuleDetail />} />} />
          <Route path="/quizes" element={<PrivateRoute element={<StudentQuizzes />} />} />
          <Route path="/performance" element={<PrivateRoute element={<StudentPerformance />} />} />
          <Route path="/quiz/:id" element={<PrivateRoute element={<StudentQuizPlay />} />} />
          <Route path="/resources/:id" element={<PrivateRoute element={<ResourceDetail />} />} />
          <Route path="/Program" element={<PrivateRoute element={<Program />} />} />

          {/* ✅ New quiz subroutes */}
          <Route path="/quizzes/gen" element={<PrivateRoute element={<GenQuiz />} />} />
          <Route path="/quizzes/play" element={<PrivateRoute element={<PlayQuiz />} />} />

          {/* Teacher */}
          <Route path="/teacher" element={<PrivateRoute element={<TeacherDashboard />} />} />
          <Route path="/create-quiz" element={<PrivateRoute element={<CreateQuiz />} />} />
          <Route path="/access-requests" element={<PrivateRoute element={<AccessRequests />} />} />
          <Route path="/teacher-settings" element={<PrivateRoute element={<TeacherSettings />} />} />
          <Route path="/teacher-chat" element={<PrivateRoute element={<TeacherChat />} />} />
          <Route path="/teacher-faq" element={<PrivateRoute element={<TeacherFAQ />} />} />
          <Route path="/teacher-courses" element={<PrivateRoute element={<TeacherCourses />} />} />
          <Route path="/add-course" element={<PrivateRoute element={<AddCourse />} />} />
          <Route path="/teacher-resources" element={<PrivateRoute element={<TeacherResources />} />} />
          <Route path="/teacher-students" element={<PrivateRoute element={<TeacherStudents />} />} />

          {/* Profile */}
          <Route path="/profile/:id" element={<PrivateRoute element={<UserProfile />} />} />
          <Route path="/profile/:id/edit" element={<PrivateRoute element={<EditProfile />} />} />

          {/* Course Structure */}
          <Route path="/modules" element={<PrivateRoute element={<ModulesPage />} />} />
          <Route path="/modules/:id/chapters" element={<PrivateRoute element={<ChaptersPage />} />} />
          <Route path="/chapters/:id/resources" element={<PrivateRoute element={<ResourcesPage />} />} />
        </Routes>
      </AnimatePresence>

      <Footer />
    </div>
  );
};

const App = () => (
  <Router>
    <AppContent />
  </Router>
);

export default App;
