// File: AccessRequests.jsx
import React from "react";
import './AccessRequests.css';

const mockRequests = [
  { id: 1, studentName: "Amine", course: "Python" },
  { id: 2, studentName: "Sara", course: "ReactJS" },
];

const AccessRequests = () => {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Demandes d'Accès</h1>
      <div className="space-y-4">
        {mockRequests.map((req) => (
          <div key={req.id} className="p-4 border rounded shadow-md flex justify-between items-center">
            <div>
              <p className="font-semibold">{req.studentName}</p>
              <p>Cours: {req.course}</p>
            </div>
            <div className="space-x-2">
              <button className="bg-green-500 text-white px-3 py-1 rounded">Accepter</button>
              <button className="bg-red-500 text-white px-3 py-1 rounded">Refuser</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AccessRequests;
