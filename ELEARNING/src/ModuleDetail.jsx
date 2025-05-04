import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { ProgressSpinner } from "primereact/progressspinner";
import { FaFilePdf, FaVideo } from "react-icons/fa";
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

  const getIcon = (type) => {
    if (type.includes("pdf")) return <FaFilePdf color="#ef4444" size={18} />;
    if (type.includes("video")) return <FaVideo color="#22d3ee" size={18} />;
    return <FaFilePdf size={18} />;
  };

  const getLabel = (type) => {
    if (type.includes("cours")) return "Cours";
    if (type.includes("tp")) return "TP";
    if (type.includes("td")) return "TD";
    return "Autre";
  };

  const allResources = module?.chapters.flatMap((chapter) =>
    chapter.resources.map((res) => ({
      ...res,
      chapterName: chapter.name,
    }))
  ) || [];

  if (loading) {
    return (
      <div className="module-detail-loading">
        <ProgressSpinner />
      </div>
    );
  }

  return (
    <div className="drive-page-container">
      <h1 className="drive-title">{module?.name}</h1>
      <p className="drive-subtitle">{module?.description}</p>

      <div className="drive-header-row">
        <span className="drive-col">Nom</span>
        <span className="drive-col">Ajouté le</span>
        <span className="drive-col">Chapitre</span>
        <span className="drive-col">Type</span>
      </div>

      <div className="drive-resource-list">
        {allResources.map((res) => (
          <a
            key={res.id}
            href={res.link}
            target="_blank"
            rel="noopener noreferrer"
            className="drive-row"
          >
            <span className="drive-col name-col">
              {getIcon(res.resource_type)} {res.name}
            </span>
            <span className="drive-col">
              {new Date(res.created_at).toLocaleDateString()}
            </span>
            <span className="drive-col">{res.chapterName}</span>
            <span className="drive-col">{getLabel(res.resource_type)}</span>
          </a>
        ))}
        {allResources.length === 0 && (
          <div className="no-resources">Aucune ressource trouvée</div>
        )}
      </div>
    </div>
  );
};

export default ModuleDetail;
