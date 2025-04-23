// TeacherDashboard.jsx
import React, { useState } from 'react';
import UploadCustomCourseForm from '../components/UploadCustomCourseForm';
import RequestList from '../components/RequestList';

const TeacherDashboard = () => {
  const [customCourses, setCustomCourses] = useState([]);
  const [requests, setRequests] = useState([
    { id: 1, studentName: 'Ali', courseName: 'Réseaux avancés', status: 'pending' },
    { id: 2, studentName: 'Sara', courseName: 'Algo L3', status: 'pending' },
  ]);

  const addCourse = (newCourse) => {
    setCustomCourses([...customCourses, newCourse]);
  };

  const handleRequestAccept = (id) => {
    setRequests(requests.map(req =>
      req.id === id ? { ...req, status: 'accepted' } : req
    ));
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Tableau de bord Professeur</h1>
      <UploadCustomCourseForm onAddCourse={addCourse} />

      <h2 className="text-xl font-semibold mt-6 mb-2">Demandes d'accès</h2>
      <RequestList requests={requests} onAccept={handleRequestAccept} />
    </div>
  );
};

export default TeacherDashboard;
