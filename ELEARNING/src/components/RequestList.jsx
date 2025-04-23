// RequestList.jsx
import React from 'react';

const RequestList = ({ requests, onAccept }) => {
  return (
    <div className="bg-white p-4 rounded shadow">
      <h3 className="text-lg font-semibold mb-3">Demandes d'accès des étudiants</h3>
      {requests.length === 0 ? (
        <p className="text-gray-500">Aucune demande en attente.</p>
      ) : (
        <ul className="space-y-3">
          {requests.map((req) => (
            <li
              key={req.id}
              className="flex justify-between items-center border p-2 rounded"
            >
              <div>
                <p className="font-medium">{req.studentName}</p>
                <p className="text-sm text-gray-500">Demande l'accès à : <strong>{req.courseName}</strong></p>
              </div>
              <button
                className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                onClick={() => onAccept(req.id)}
              >
                Accepter
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default RequestList;
