// File: TeacherResources.jsx
import React from "react";
import './TeacherResources.css';

const mockResources = [
  { id: 1, name: "Cours HTML5", type: "PDF" },
  { id: 2, name: "Tutoriel React", type: "Vidéo" },
];

const TeacherResources = () => {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Mes Ressources</h1>
      <div className="space-y-4">
        {mockResources.map((resource) => (
          <div
            key={resource.id}
            className="p-4 border rounded shadow-md hover:shadow-lg transition"
          >
            <h2 className="text-lg font-semibold">{resource.name}</h2>
            <p>Type: {resource.type}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeacherResources;
