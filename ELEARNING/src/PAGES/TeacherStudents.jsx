// File: TeacherStudents.jsx
import React from "react";
import './TeacherStudents.css';

const mockStudents = [
  { id: 1, name: "Amine", level: "L1" },
  { id: 2, name: "Sara", level: "L2" },
  { id: 3, name: "Yasmine", level: "L3" },
];

const TeacherStudents = () => {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Mes Étudiants</h1>
      <table className="w-full border">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 border">Nom</th>
            <th className="p-2 border">Niveau</th>
          </tr>
        </thead>
        <tbody>
          {mockStudents.map((student) => (
            <tr key={student.id} className="hover:bg-gray-50">
              <td className="p-2 border">{student.name}</td>
              <td className="p-2 border">{student.level}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TeacherStudents;
