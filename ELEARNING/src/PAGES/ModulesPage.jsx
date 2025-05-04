import React, { useEffect, useState } from 'react';
import { getModules } from '../services/modulesService';
import { Link } from 'react-router-dom';

const ModulesPage = () => {
  const [modules, setModules] = useState([]);

  useEffect(() => {
    getModules().then(setModules);
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">📘 Modules disponibles</h1>
      {modules.map(mod => (
        <div key={mod.id} className="border p-4 rounded shadow mb-2">
          <h2 className="text-lg font-semibold">{mod.name}</h2>
          <p>{mod.description}</p>
          <p><strong>Niveau:</strong> {mod.level.name} | <strong>Spécialité:</strong> {mod.speciality.name}</p>
          <Link to={`/modules/${mod.id}/chapters`} className="text-blue-600 underline">Voir les chapitres</Link>
        </div>
      ))}
    </div>
  );
};

export default ModulesPage;
