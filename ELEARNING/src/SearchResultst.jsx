import React, { useEffect, useState } from "react";
import "./SearchResults.css";

const SearchResults = () => {
  const [results, setResults] = useState(null);
  const [query, setQuery] = useState("");
  const [accessRequested, setAccessRequested] = useState({});

  useEffect(() => {
    const stored = localStorage.getItem("searchResults");
    const storedQuery = localStorage.getItem("searchQuery");
    const storedAccess = localStorage.getItem("accessRequested");

    if (stored) setResults(JSON.parse(stored));
    if (storedQuery) setQuery(storedQuery);
    if (storedAccess) setAccessRequested(JSON.parse(storedAccess));
  }, []);

  const handleRequestAccess = async (resourceId) => {
    try {
      const token = localStorage.getItem("accessToken");
      await fetch(`http://127.0.0.1:8000/api/courses/resources/request/${resourceId}/`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });

      const updated = { ...accessRequested, [resourceId]: true };
      setAccessRequested(updated);
      localStorage.setItem("accessRequested", JSON.stringify(updated));
    } catch (err) {
      console.error("Erreur lors de la demande d'accès:", err);
    }
  };

  const renderResources = (resources) =>
    resources.map((res) => (
      <div key={res.id} className="resource-card animated">
        <div className="resource-header">
          <a href={res.link} target="_blank" rel="noreferrer" className="resource-link">
            🔗 {res.name}
          </a>
          <span className="type-tag">{res.resource_type}</span>
        </div>
        <div className="resource-meta">
          <span>👤 {res.owner_name}</span>
          <span>🕒 {new Date(res.created_at).toLocaleDateString()}</span>
          <span className={`access-tag ${res.access_type}`}>
            {res.access_type === "public" ? (
              "🔓 Public"
            ) : res.access_approved ? (
              "🔒 Privé (accepté)"
            ) : accessRequested[res.id] ? (
              <span className="pending">🔒 Privé (en attente)</span>
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
        </div>
      </div>
    ));

  if (!results || Object.values(results).every((arr) => Array.isArray(arr) && arr.length === 0)) {
    return <div className="no-results">❌ Aucun résultat trouvé.</div>;
  }

  return (
    <div className="search-results-container">
      <h2 className="results-title">
        🔍 Résultats de recherche pour : <span className="query-highlight">{query}</span>
      </h2>

      <div className="results-box">
        {results.specialities?.map((spec) => (
          <details key={spec.id} className="level-drop">
            <summary>🧠 Spécialité : {spec.name}</summary>
            {spec.levels.map((lvl) => (
              <details key={lvl.id} className="level-drop">
                <summary>📘 Niveau : {lvl.name}</summary>
                {lvl.module_set.map((mod) => (
                  <details key={mod.id} className="level-drop">
                    <summary>📗 Module : {mod.name}</summary>
                    {mod.chapters.map((chap) => (
                      <details key={chap.id} className="level-drop">
                        <summary>📙 Chapitre : {chap.name}</summary>
                        {renderResources(chap.all_resources)}
                      </details>
                    ))}
                  </details>
                ))}
              </details>
            ))}
          </details>
        ))}

        {results.levels?.map((lvl) => (
          <details key={lvl.id} className="level-drop">
            <summary>📘 Niveau : {lvl.name}</summary>
            {lvl.module_set.map((mod) => (
              <details key={mod.id} className="level-drop">
                <summary>📗 Module : {mod.name}</summary>
                {mod.chapters.map((chap) => (
                  <details key={chap.id} className="level-drop">
                    <summary>📙 Chapitre : {chap.name}</summary>
                    {renderResources(chap.all_resources)}
                  </details>
                ))}
              </details>
            ))}
          </details>
        ))}

        {results.modules?.map((mod) => (
          <details key={mod.id} className="level-drop">
            <summary>📗 Module : {mod.name}</summary>
            {mod.chapters.map((chap) => (
              <details key={chap.id} className="level-drop">
                <summary>📙 Chapitre : {chap.name}</summary>
                {renderResources(chap.all_resources)}
              </details>
            ))}
          </details>
        ))}

        {results.chapters?.map((chap) => (
          <details key={chap.id} className="level-drop">
            <summary>📙 Chapitre : {chap.name}</summary>
            {renderResources(chap.all_resources)}
          </details>
        ))}

        {results.resources?.map((res) => (
          <div key={res.id} className="resource-card animated">
            <div className="resource-header">
              <a href={res.link} target="_blank" rel="noreferrer" className="resource-link">
                🔗 {res.name}
              </a>
              <span className="type-tag">{res.resource_type}</span>
            </div>
            <div className="resource-meta">
              <span>👤 {res.owner_name}</span>
              <span>🕒 {new Date(res.created_at).toLocaleDateString()}</span>
              <span className={`access-tag ${res.access_type}`}>
                {res.access_type === "public" ? (
                  "🔓 Public"
                ) : res.access_approved ? (
                  "🔒 Privé (accepté)"
                ) : accessRequested[res.id] ? (
                  <span className="pending">🔒 Privé (en attente)</span>
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
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchResults;
