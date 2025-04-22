import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Card } from "primereact/card";
import { ProgressSpinner } from "primereact/progressspinner";
import "./ModuleDetail.css";

const ModuleDetail = () => {
  const { id } = useParams();
  const [module, setModule] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`http://127.0.0.1:8000/api/modules/${id}/`)
      .then((res) => {
        setModule(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Erreur de chargement du module:", err);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="loading-container">
        <ProgressSpinner />
      </div>
    );
  }

  if (!module) {
    return <div className="error-message">Module introuvable</div>;
  }

  return (
    <div className="module-detail-container">
      <h1 className="module-title">📘 {module.name}</h1>
      <p className="module-description">{module.description}</p>

      <h2 className="section-title">📂 Chapitres</h2>
      {module.chapters && module.chapters.length > 0 ? (
        module.chapters.map((chapter) => (
          <Card key={chapter.id} className="chapter-card">
            <h3>{chapter.name}</h3>
            {chapter.resources && chapter.resources.length > 0 ? (
              <ul className="resource-list">
                {chapter.resources.map((res) => (
                  <li key={res.id}>{res.name} ({res.resource_type})</li>
                ))}
              </ul>
            ) : (
              <p className="no-resources">Aucune ressource disponible.</p>
            )}
          </Card>
        ))
      ) : (
        <p className="no-chapters">Aucun chapitre pour ce module.</p>
      )}
    </div>
  );
};

export default ModuleDetail;
