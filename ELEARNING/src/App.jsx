import { AnimatePresence } from "framer-motion";
import React from "react";
import { BrowserRouter as Router, Route, Routes, useLocation, Navigate } from "react-router-dom";

// Components
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
import TeacherDashboard from "./PAGES/TeacherDashboard";
import StudentQuizzes from "./StudentQuizzes";
import StudentPerformance from "./StudentPerformance";
import StudentProfessors from "./StudentProfessors";
import TeacherCourses from "./PAGES/TeacherCourses";
import AddCourse from "./PAGES/AddCourse";
import TeacherResources from "./PAGES/TeacherResources";
import TeacherStudents from "./PAGES/TeacherStudents";
import ResourceDetail from "./ResourceDetail";
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
import AnnouncementsPage from "./PAGES/AnnouncementsPage";
import ChooseModules from "./PAGES/ChooseModules";
import SearchResults from "./SearchResults";
import TeacherProfile from "./PAGES/TeacherProfile";
import SearchResultst from "./SearchResultst";
import GenQuiz from "./GenQuiz";
import PlayQuiz from "./PlayQuiz";
import AssignModules from "./AssignModules";

// 🔐 Private route handler
const PrivateRoute = ({ element, allowedRoles }) => {
  const token = localStorage.getItem("accessToken");
  const userType = localStorage.getItem("userType");
  if (!token) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(userType)) return <Navigate to="/" replace />;
  return element;
};

const AppContent = () => {
  const location = useLocation();

  const isStudentHeader = [
    "/student", "/chat", "/courses", "/my-modules", "/studentsettings",
    "/faq", "/modules/", "/quizes", "/quiz/", "/performance", "/profile",
    "/StudentProfessors", "/Program", "/quizzes/gen", "/quizzes/play",
    "/search-results", "/announcements", "/assign-modules"
  ].some(path => location.pathname.startsWith(path));

  const isTeacherHeader = [
    "/teacher", "/create-quiz", "/access-requests", "/teacher-settings",
    "/teacher-chat", "/teacher-faq", "/teacher-courses", "/add-course",
    "/teacher-resources", "/teacher-students", "/choose-modules",
    "/teacher-profile", "/teacher-search-results"
  ].some(path => location.pathname.startsWith(path));

  return (
    <div className="app-container">
      {isStudentHeader ? <StudentHeader /> : isTeacherHeader ? <TeacherHeader /> : <Header />}

      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Student Only */}
          <Route path="/student" element={<PrivateRoute element={<Student />} allowedRoles={["student"]} />} />
          <Route path="/announcements" element={<PrivateRoute element={<AnnouncementsPage />} allowedRoles={["student"]} />} />
          <Route path="/chat" element={<PrivateRoute element={<Chat />} allowedRoles={["student"]} />} />
          <Route path="/courses" element={<PrivateRoute element={<Courses />} allowedRoles={["student"]} />} />
          <Route path="/my-modules" element={<PrivateRoute element={<MyModules />} allowedRoles={["student"]} />} />
          <Route path="/notification" element={<PrivateRoute element={<Notification />} allowedRoles={["student"]} />} />
          <Route path="/StudentProfessors" element={<PrivateRoute element={<StudentProfessors />} allowedRoles={["student"]} />} />
          <Route path="/studentsettings" element={<PrivateRoute element={<StudentSettings />} allowedRoles={["student"]} />} />
          <Route path="/studentsettings/edit" element={<PrivateRoute element={<StudentSettingsEdit />} allowedRoles={["student"]} />} />
          <Route path="/faq" element={<PrivateRoute element={<StudentFAQ />} allowedRoles={["student"]} />} />
          <Route path="/modules/:id" element={<PrivateRoute element={<ModuleDetail />} allowedRoles={["student"]} />} />
          <Route path="/quizes" element={<PrivateRoute element={<StudentQuizzes />} allowedRoles={["student"]} />} />
          <Route path="/performance" element={<PrivateRoute element={<StudentPerformance />} allowedRoles={["student"]} />} />
          <Route path="/quiz/:id" element={<PrivateRoute element={<StudentQuizPlay />} allowedRoles={["student"]} />} />
          <Route path="/resources/:id" element={<PrivateRoute element={<ResourceDetail />} allowedRoles={["student"]} />} />
          <Route path="/Program" element={<PrivateRoute element={<Program />} allowedRoles={["student"]} />} />
          <Route path="/quizzes/gen" element={<PrivateRoute element={<GenQuiz />} allowedRoles={["student"]} />} />
          <Route path="/quizzes/play" element={<PrivateRoute element={<PlayQuiz />} allowedRoles={["student"]} />} />
          <Route path="/assign-modules" element={<PrivateRoute element={<AssignModules />} allowedRoles={["student"]} />} />

          {/* Teacher Only */}
          <Route path="/teacher" element={<PrivateRoute element={<TeacherDashboard />} allowedRoles={["professor"]} />} />
          <Route path="/create-quiz" element={<PrivateRoute element={<CreateQuiz />} allowedRoles={["professor"]} />} />
          <Route path="/access-requests" element={<PrivateRoute element={<AccessRequests />} allowedRoles={["professor"]} />} />
          <Route path="/teacher-settings" element={<PrivateRoute element={<TeacherSettings />} allowedRoles={["professor"]} />} />
          <Route path="/teacher-chat" element={<PrivateRoute element={<TeacherChat />} allowedRoles={["professor"]} />} />
          <Route path="/teacher-faq" element={<PrivateRoute element={<TeacherFAQ />} allowedRoles={["professor"]} />} />
          <Route path="/teacher-courses" element={<PrivateRoute element={<TeacherCourses />} allowedRoles={["professor"]} />} />
          <Route path="/add-course" element={<PrivateRoute element={<AddCourse />} allowedRoles={["professor"]} />} />
          <Route path="/teacher-resources" element={<PrivateRoute element={<TeacherResources />} allowedRoles={["professor"]} />} />
          <Route path="/teacher-students" element={<PrivateRoute element={<TeacherStudents />} allowedRoles={["professor"]} />} />
          <Route path="/choose-modules" element={<PrivateRoute element={<ChooseModules />} allowedRoles={["professor"]} />} />
          <Route path="/teacher-profile/:id/edit" element={<PrivateRoute element={<TeacherProfile />} allowedRoles={["professor"]} />} />
          <Route path="/teacher-search-results" element={<PrivateRoute element={<SearchResultst />} allowedRoles={["professor"]} />} />

          {/* Shared */}
          <Route path="/profile/:id" element={<PrivateRoute element={<UserProfile />} allowedRoles={["student", "professor"]} />} />
          <Route path="/profile/:id/edit" element={<PrivateRoute element={<EditProfile />} allowedRoles={["student", "professor"]} />} />
          <Route path="/modules" element={<PrivateRoute element={<ModulesPage />} allowedRoles={["student", "professor"]} />} />
          <Route path="/modules/:id/chapters" element={<PrivateRoute element={<ChaptersPage />} allowedRoles={["student", "professor"]} />} />
          <Route path="/chapters/:id/resources" element={<PrivateRoute element={<ResourcesPage />} allowedRoles={["student", "professor"]} />} />

          {/* Public route accessible par tous */}
          <Route path="/search-results" element={<SearchResults />} />
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
