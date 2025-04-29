// File: TeacherCourses.jsx
import React from "react";
import { Card } from "primereact/card";
import { useNavigate } from "react-router-dom";

const mockCourses = [
  { id: 1, title: "Programmation Python", type: "PDF" },
  { id: 2, title: "Développement Web", type: "Vidéo" },
];

const TeacherCourses = () => {
  const navigate = useNavigate();

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Mes Cours</h1>
      <button
        onClick={() => navigate("/add-course")}
        className="bg-blue-600 text-white px-4 py-2 rounded mb-6"
      >
        Ajouter un cours
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {mockCourses.map((course) => (
          <Card key={course.id} title={course.title}>
            <p>Type: {course.type}</p>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default TeacherCourses;
