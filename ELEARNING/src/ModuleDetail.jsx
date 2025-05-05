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
  const [accessRequested, setAccessRequested] = useState({});

  useEffect(() => {
    const fetchModule = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const res = await axios.get(`http://127.0.0.1:8000/api/users/modules/${id}/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setModule(res.data);
      } catch (err) {
        console.error("Erreur de chargement du module:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchModule();
  }, [id]);

  const handleRequestAccess = async (resourceId) => {
    const token = localStorage.getItem("accessToken");
    try {
      await axios.post(
        "http://127.0.0.1:8000/api/courses/resources/request/",
        { resource: resourceId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setAccessRequested((prev) => ({ ...prev, [resourceId]: true }));
      alert("✅ Demande d'accès envoyée !");
    } catch (err) {
      console.error("❌ Erreur demande d'accès:", err);
      alert("Erreur lors de la demande d'accès.");
    }
  };

  const getIcon = (type) => {
    if (type.includes("pdf")) return <FaFilePdf color="#ef4444" size={16} />;
    if (type.includes("video")) return <FaVideo color="#22d3ee" size={16} />;
    return <FaFilePdf size={16} />;
  };

  const getLabel = (type) => {
    if (type.includes("cours")) return "Cours";
    if (type.includes("tp")) return "TP";
    if (type.includes("td")) return "TD";
    return "Autre";
  };

  const allResources =
    module?.chapters?.flatMap((chapter) =>
      (chapter.all_resources || []).map((res) => ({
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

      {allResources.length > 0 ? (
        <>
          <div className="drive-header-row">
            <span className="drive-col">Nom</span>
            <span className="drive-col">Ajouté le</span>
            <span className="drive-col">Chapitre</span>
            <span className="drive-col">Accès</span>
            <span className="drive-col">Auteur</span>
          </div>

          <div className="drive-resource-list">
            {allResources.map((res) => {
              const isAccessible = Boolean(res.link);

              return (
                <div
                  key={res.id}
                  className="drive-row"
                  style={{ cursor: isAccessible ? "pointer" : "default" }}
                  onClick={() => {
                    if (isAccessible) {
                      window.open(res.link, "_blank");
                    }
                  }}
                >
                  <span className="drive-col name-col">
                    {getIcon(res.resource_type)} {res.name}
                  </span>

                  <span className="drive-col">
                    {res.created_at
                      ? new Date(res.created_at).toLocaleString("fr-FR")
                      : "—"}
                  </span>

                  <span className="drive-col">{res.chapterName}</span>

                  <span className="drive-col">
                    {res.link ? (
                      res.access_type === "public" ? "🔓 Public" : "🔒 Privé (accepté)"
                    ) : accessRequested[res.id] ? (
                      <span style={{ color: "#aaa", fontStyle: "italic" }}>
                        Demande envoyée
                      </span>
                    ) : (
                      <button
                        onClick={(e) => {
                          e.stopPropagation(); // prevent row click
                          handleRequestAccess(res.id);
                        }}
                        className="request-access-btn"
                        style={{
                          background: "#9333ea",
                          color: "white",
                          border: "none",
                          padding: "6px 12px",
                          borderRadius: "6px",
                          cursor: "pointer",
                        }}
                      >
                        Demander l'accès
                      </button>
                    )}
                  </span>

                  <span className="drive-col">{res.owner || "—"}</span>
                </div>
              );
            })}
          </div>
        </>
      ) : (
        <p className="no-resources">Aucune ressource trouvée</p>
      )}
    </div>
  );
};

export default ModuleDetail;
