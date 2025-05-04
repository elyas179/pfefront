import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getResourcesByChapter } from '../services/resourcesService';
import { requestAccess } from '../services/accessRequestsService';

const ResourcesPage = () => {
  const { id } = useParams();
  const [resources, setResources] = useState([]);

  useEffect(() => {
    getResourcesByChapter(id).then(setResources);
  }, [id]);

  const handleAccessRequest = async (resourceId) => {
    try {
      await requestAccess(resourceId, "Bonjour, je souhaite accéder à cette ressource.");
      alert("Demande envoyée avec succès !");
    } catch (error) {
      console.error(error);
      alert("Erreur lors de l'envoi de la demande.");
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">📚 Ressources du chapitre</h1>
      {resources.map(res => (
        <div key={res.id} className="border p-4 rounded shadow mb-2">
          <h2>{res.name}</h2>
          <p><strong>Type:</strong> {res.resource_type}</p>
          <p><strong>Accès:</strong> {res.access_type}</p>
          {res.access_type === 'public' ? (
            <a href={res.link} target="_blank" rel="noopener noreferrer" className="text-green-600 underline">Voir la ressource</a>
          ) : (
            <button onClick={() => handleAccessRequest(res.id)} className="bg-blue-500 text-white px-4 py-1 rounded">
              Demander l'accès
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

export default ResourcesPage;
