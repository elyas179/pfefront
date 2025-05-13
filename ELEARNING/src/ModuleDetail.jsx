import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { ProgressSpinner } from "primereact/progressspinner";
import { FaFilePdf, FaVideo } from "react-icons/fa";
import { Accordion, AccordionTab } from "primereact/accordion";
import "./ModuleDetail.css";

const formatDate = (dateStr) => {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleString("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

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
    if (!resourceId) {
      alert("Ressource invalide.");
      return;
    }
    const token = localStorage.getItem("accessToken");
    try {
      await axios.post(
        `http://127.0.0.1:8000/api/courses/resources/request/${resourceId}/`,
        {},
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
      alert(err.response?.data?.detail || "Erreur lors de la demande d'accès.");
    }
  };

  const getIcon = (type) => {
    if (type.includes("pdf")) return <FaFilePdf color="#ef4444" size={16} />;
    if (type.includes("video")) return <FaVideo color="#22d3ee" size={16} />;
    return <FaFilePdf size={16} />;
  };

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

      {module?.chapters?.length > 0 ? (
        <Accordion multiple>
          {module.chapters.map((chapter, index) => (
            <AccordionTab key={index} header={chapter.name}>
              {chapter.all_resources?.length > 0 ? (
                <div className="drive-header-row">
                  <span className="drive-col">Nom</span>
                  <span className="drive-col">Ajouté le</span>
                  <span className="drive-col">Accès</span>
                  <span className="drive-col">Auteur</span>
                </div>
              ) : (
                <p className="no-resources">Aucune ressource dans ce chapitre.</p>
              )}

              {chapter.all_resources?.map((res) => {
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
                      <div style={{ display: "flex", flexDirection: "column" }}>
                        <span>
                          {getIcon(res.resource_type)} {res.name}
                        </span>
                        <span style={{ fontSize: "0.8rem", color: "#999" }}>
                          Auteur: {res.owner_name || "—"}
                        </span>
                      </div>
                    </span>

                    <span className="drive-col">{formatDate(res.created_at)}</span>

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
                            e.stopPropagation();
                            handleRequestAccess(res.id);
                          }}
                          className="request-access-btn"
                        >
                          Demander l'accès
                        </button>
                      )}
                    </span>

                    <span className="drive-col">{res.owner_name || "—"}</span>
                  </div>
                );
              })}
            </AccordionTab>
          ))}
        </Accordion>
      ) : (
        <p className="no-resources">Aucun chapitre trouvé pour ce module.</p>
      )}
    </div>
  );
};

export default ModuleDetail;
