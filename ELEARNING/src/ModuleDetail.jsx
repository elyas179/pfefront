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
    const fetchModule = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/users/modules/${id}/`);
        setModule(response.data);
      } catch (error) {
        console.error("Erreur de chargement du module:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchModule();
  }, [id]);

  if (loading) {
    return (
      <div className="module-detail-loading">
        <ProgressSpinner />
      </div>
    );
  }

  if (!module) {
    return (
      <motion.div
        className="module-error"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        🚫 Module introuvable
      </motion.div>
    );
  }

  return (
    <motion.div
      className="module-detail-container"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="module-title">📘 {module.name}</h1>
      {module.description && (
        <p className="module-description">{module.description}</p>
      )}

      <h2 className="module-section-title">📂 Chapitres</h2>

      <div className="chapters-grid">
        {module.chapters.length > 0 ? (
          module.chapters.map((chapter) => (
            <motion.div
              key={chapter.id}
              className="chapter-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <h3 className="chapter-title">📖 {chapter.name}</h3>

              <div className="resources-grid">
                {chapter.resources.length > 0 ? (
                  chapter.resources.map((res) => (
                    <a
                      href={res.link}
                      key={res.id}
                      className="resource-card-link"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <motion.div
                        className="resource-card"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Tag
                          value={res.resource_type.replace("-", " ").toUpperCase()}
                          severity="info"
                          style={{ marginBottom: "1rem" }}
                        />
                        <h4 className="resource-title">{res.name}</h4>
                      </motion.div>
                    </a>
                  ))
                ) : (
                  <p className="no-resources">Aucune ressource disponible.</p>
                )}
              </div>
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
