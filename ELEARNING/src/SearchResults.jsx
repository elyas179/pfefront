import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { Card } from "primereact/card";
import { Accordion, AccordionTab } from "primereact/accordion";
import axios from "axios";
import "./SearchResults.css";

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

const SearchResults = () => {
  const { state } = useLocation();
  const { data, query } = state || {};
  const [accessRequested, setAccessRequested] = useState({});

  if (!data) return <div className="no-results">Aucun résultat trouvé.</div>;

  const openLink = (url) => {
    if (url) window.open(url, "_blank");
  };

  const requestAccess = async (resourceId) => {
    const token = localStorage.getItem("accessToken");
    try {
      await axios.post(
        `http://127.0.0.1:8000/api/courses/resources/request/${resourceId}/`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setAccessRequested((prev) => ({ ...prev, [resourceId]: true }));
      alert("Demande envoyée avec succès");
    } catch (err) {
      if (err.response?.status === 400) {
        alert("Demande déjà envoyée ou invalide.");
      } else {
        alert("Erreur lors de la demande d'accès");
      }
    }
  };

  const renderResources = (resources) => (
    <div className="resource-table">
      <div className="resource-header-row">
        <span className="resource-col">Nom</span>
        <span className="resource-col">Ajouté le</span>
        <span className="resource-col">Accès</span>
        <span className="resource-col">Auteur</span>
      </div>
      {resources?.map((r) => {
        const isAccessible = r.access_type === "public" || r.access_approved;
        return (
          <div
            key={r.id}
            className="resource-data-row"
            onClick={() => isAccessible && openLink(r.link)}
            style={{ cursor: isAccessible ? "pointer" : "default" }}
          >
            <span className="resource-col">
              <div style={{ display: "flex", flexDirection: "column" }}>
                <span>{r.name}</span>
                <span style={{ fontSize: "0.8rem", color: "#999" }}>
                  Auteur: {r.owner_name || "—"}
                </span>
              </div>
            </span>

            <span className="resource-col">{formatDate(r.created_at)}</span>

            <span className="resource-col">
              {isAccessible ? (
                r.access_type === "public" ? (
                  "🔓 Public"
                ) : (
                  "🔒 Privé (accepté)"
                )
              ) : accessRequested[r.id] ? (
                <span style={{ color: "#aaa", fontStyle: "italic" }}>
                  Demande envoyée
                </span>
              ) : (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    requestAccess(r.id);
                  }}
                  className="access-btn"
                >
                  Demander l'accès
                </button>
              )}
            </span>

            <span className="resource-col">{r.owner_name || "—"}</span>
          </div>
        );
      })}
    </div>
  );

  const renderChapters = (chapters) =>
    chapters?.map((ch) => (
      <AccordionTab key={ch.id} header={`📘 ${ch.name}`}>
        {renderResources(ch.all_resources)}
      </AccordionTab>
    ));

  const renderModules = (modules) =>
    modules?.map((mod) => (
      <AccordionTab key={mod.id} header={`📗 ${mod.name}`}>
        <Accordion multiple>{renderChapters(mod.chapters)}</Accordion>
      </AccordionTab>
    ));

  const renderLevels = (levels) =>
    levels?.map((lvl) => (
      <AccordionTab key={lvl.id} header={`📙 ${lvl.name}`}>
        <Accordion multiple>{renderModules(lvl.module_set)}</Accordion>
      </AccordionTab>
    ));

  const renderSpecialities = (specialities) =>
    specialities?.map((spec) => (
      <AccordionTab key={spec.id} header={`🎓 ${spec.name}`}>
        <Accordion multiple>{renderLevels(spec.levels)}</Accordion>
      </AccordionTab>
    ));

  return (
    <div className="search-results-container">
      <h2>Résultats pour : "{query}"</h2>
      <Card className="results-card">
        <Accordion multiple>
          {renderSpecialities(data.specialities)}
          {renderLevels(data.levels)}
          {renderModules(data.modules)}
          {renderChapters(data.chapters)}
          {data.resources?.length > 0 && (
            <AccordionTab header="📄 Ressources directes">
              {renderResources(data.resources)}
            </AccordionTab>
          )}
        </Accordion>
      </Card>
    </div>
  );
};

export default SearchResults;
