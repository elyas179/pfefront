
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
               disabled={req.status === 'accepted'}
               className={`px-4 py-2 rounded text-white font-semibold transition ${
                 req.status === 'accepted'
                   ? 'bg-gray-400 cursor-not-allowed'
                   : 'bg-green-500 hover:bg-green-600'
               }`}
               onClick={() => onAccept(req.id)}
              >
                {req.status === 'accepted' ? 'Acceptée' : 'Accepter'}
                
              </button>

            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default RequestList;
