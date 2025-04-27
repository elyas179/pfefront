// File: ModuleDetail.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Card } from "primereact/card";
import { ProgressSpinner } from "primereact/progressspinner";
import { Tag } from "primereact/tag";
import { motion } from "framer-motion";
import "./ModuleDetail.css";

const ModuleDetail = () => {
  const { id } = useParams();
  const [module, setModule] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`http://127.0.0.1:8000/api/users/modules/${id}/`)
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
      <div className="module-detail-loading">
        <ProgressSpinner />
      </div>
    );
  }

  if (!module) {
    return <div className="module-error">🚫 Module introuvable</div>;
  }

  return (
    <motion.div
      className="module-detail-container"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="module-title">📘 {module.name}</h1>
      <p className="module-description">{module.description}</p>

      <h2 className="module-section-title">📂 Chapitres</h2>
      <div className="chapters-grid">
        {module.chapters.length > 0 ? (
          module.chapters.map((chapter) => (
            <motion.div
              className="chapter-card"
              key={chapter.id}
              whileHover={{ scale: 1.04 }}
            >
              <h3 className="chapter-title">{chapter.name}</h3>
              {chapter.resources.length > 0 ? (
                <ul className="resource-list">
                  {chapter.resources.map((res) => (
                    <li key={res.id} className="resource-item">
                      <Tag
                        value={res.resource_type}
                        severity="info"
                        style={{ marginRight: "0.5rem" }}
                      />
                      {res.name}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="no-resources">Aucune ressource disponible.</p>
              )}
            </motion.div>
          ))
        ) : (
          <p className="no-chapters">Aucun chapitre disponible.</p>
        )}
      </div>
    </motion.div>
  );
};

export default ModuleDetail;
