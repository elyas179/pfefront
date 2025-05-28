import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import "./TeacherCourses.css";

const MODULES_ENDPOINT = "http://127.0.0.1:8000/api/users/choosemodules/";
const RESOURCES_ENDPOINT = "http://127.0.0.1:8000/api/courses/resources/my/";

const resourceTypes = [
  "cours-pdf",
  "cours-vidéo",
  "td-pdf",
  "td-vidéo",
  "tp-pdf",
  "tp-vidéo",
];
const accessTypes = [
  { value: "public", label: "Public" },
  { value: "private", label: "Privé" },
];

const getToken = () => localStorage.getItem("accessToken");

function TeacherCourses() {
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedModule, setExpandedModule] = useState(null);
  const [expandedChapter, setExpandedChapter] = useState(null);
  const [resources, setResources] = useState({});
  const [addForm, setAddForm] = useState({});
  const [editForm, setEditForm] = useState({});
  const [editOpen, setEditOpen] = useState(null);
  const [globalMsg, setGlobalMsg] = useState("");
  const [actionLoading, setActionLoading] = useState({});

  useEffect(() => {
    fetchModules();
  }, []);

  const fetchModules = async () => {
    setLoading(true);
    try {
      const token = getToken();
      const res = await axios.get(MODULES_ENDPOINT, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setModules(Array.isArray(res.data) ? res.data : res.data.results || []);
    } catch (e) {
      setGlobalMsg("Erreur de chargement des modules.");
    }
    setLoading(false);
  };

  const fetchResources = async (chapterId) => {
    try {
      const token = getToken();
      const res = await axios.get(RESOURCES_ENDPOINT + `?chapter=${chapterId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setResources((prev) => ({
        ...prev,
        [chapterId]: Array.isArray(res.data) ? res.data : [],
      }));
    } catch {
      setResources((prev) => ({ ...prev, [chapterId]: [] }));
    }
  };

  const handleModuleAccordion = (moduleId) => {
    setExpandedModule(expandedModule === moduleId ? null : moduleId);
    setExpandedChapter(null);
  };

  const handleChapterAccordion = (chapterId) => {
    setExpandedChapter(expandedChapter === chapterId ? null : chapterId);
    if (expandedChapter !== chapterId) {
      fetchResources(chapterId);
    }
  };

  const handleAddFormChange = (chapterId, field, value) => {
    setAddForm({
      ...addForm,
      [chapterId]: { ...addForm[chapterId], [field]: value },
    });
  };

  const handleEditFormChange = (resourceId, field, value) => {
    setEditForm({
      ...editForm,
      [resourceId]: { ...editForm[resourceId], [field]: value },
    });
  };

  const getLinkValue = (form, fallback = "") => {
    return form?.link !== undefined ? form.link : fallback;
  };

  const handleAddResource = async (chapterId) => {
    const form = addForm[chapterId] || {};
    const data = {
      ...form,
      name: form.name || "",
      resource_type: form.resource_type || "cours-pdf",
      link: getLinkValue(form, ""),
      chapter: chapterId,
      access_type: form.access_type || "public",
    };
    if (!data.name) return;
    setActionLoading((l) => ({ ...l, ["add-" + chapterId]: true }));
    try {
      const token = getToken();
      await axios.post(
        "http://127.0.0.1:8000/api/courses/resources/",
        data,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAddForm((f) => ({ ...f, [chapterId]: {} }));
      fetchResources(chapterId);
    } catch {
      setGlobalMsg("Erreur lors de l'ajout.");
    }
    setActionLoading((l) => ({ ...l, ["add-" + chapterId]: false }));
  };

  const handleEditResource = async (resId, chapterId) => {
    const form = editForm[resId] || {};
    const data = { ...form, link: getLinkValue(form, "") };
    setActionLoading((l) => ({ ...l, ["edit-" + resId]: true }));
    try {
      const token = getToken();
      await axios.patch(
        `http://127.0.0.1:8000/api/courses/resources/${resId}/edit/`,
        data,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setEditOpen(null);
      fetchResources(chapterId);
    } catch {
      setGlobalMsg("Erreur lors de la modification.");
    }
    setActionLoading((l) => ({ ...l, ["edit-" + resId]: false }));
  };

  const handleDeleteResource = async (resId, chapterId) => {
    if (!window.confirm("Supprimer cette ressource ?")) return;
    setActionLoading((l) => ({ ...l, ["delete-" + resId]: true }));
    try {
      const token = getToken();
      await axios.delete(
        `http://127.0.0.1:8000/api/courses/resources/${resId}/delete/`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchResources(chapterId);
    } catch {
      setGlobalMsg("Erreur lors de la suppression.");
    }
    setActionLoading((l) => ({ ...l, ["delete-" + resId]: false }));
  };

  return (
    <div className="tc-container">
      <h1 className="tc-title">Mes modules</h1>
      {globalMsg && <div className="tc-message">{globalMsg}</div>}
      {loading ? (
        <div className="tc-loading">Chargement...</div>
      ) : modules.length === 0 ? (
        <div className="tc-empty">Aucun module trouvé.</div>
      ) : (
        <div className="tc-accordion-list">
          {modules.map((module) => (
            <div key={module.id} className="tc-accordion">
              <button
                className={`tc-accordion-header ${expandedModule === module.id ? "active" : ""}`}
                onClick={() => handleModuleAccordion(module.id)}
              >
                <span>{module.name}</span>
                <span className="tc-arrow">{expandedModule === module.id ? "▲" : "▼"}</span>
              </button>
              <AnimatePresence initial={false}>
                {expandedModule === module.id && (
                  <motion.div
                    className="tc-accordion-panel open"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.23, ease: "easeInOut" }}
                  >
                    <div className="tc-chapters-list">
                      {module.chapters.length === 0 ? (
                        <div className="tc-empty">Aucun chapitre.</div>
                      ) : (
                        module.chapters.map((chapter) => (
                          <div key={chapter.id} className="tc-accordion tc-chapter-accordion">
                            <button
                              className={`tc-accordion-header chapter-header ${expandedChapter === chapter.id ? "active" : ""}`}
                              onClick={() => handleChapterAccordion(chapter.id)}
                            >
                              <span>{chapter.name}</span>
                              <span className="tc-arrow">{expandedChapter === chapter.id ? "▲" : "▼"}</span>
                            </button>
                            <AnimatePresence initial={false}>
                              {expandedChapter === chapter.id && (
                                <motion.div
                                  className="tc-accordion-panel chapter-panel open"
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: "auto", opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  transition={{ duration: 0.20 }}
                                >
                                  <div>
                                    <div className="tc-resources-list">
                                      {resources[chapter.id] && resources[chapter.id].length > 0 ? (
                                        resources[chapter.id].map((res) => (
                                          <motion.div
                                            key={res.id}
                                            className="tc-resource-card inline"
                                            initial={{ y: 10, opacity: 0 }}
                                            animate={{ y: 0, opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            transition={{ duration: 0.15 }}
                                          >
                                            {editOpen === res.id ? (
                                              <div className="tc-resource-form inline">
                                                <input
                                                  type="text"
                                                  placeholder="Nom"
                                                  value={editForm[res.id]?.name ?? res.name}
                                                  onChange={(e) =>
                                                    handleEditFormChange(res.id, "name", e.target.value)
                                                  }
                                                  disabled={actionLoading["edit-" + res.id]}
                                                />
                                                <select
                                                  value={editForm[res.id]?.resource_type ?? res.resource_type}
                                                  onChange={(e) =>
                                                    handleEditFormChange(res.id, "resource_type", e.target.value)
                                                  }
                                                  disabled={actionLoading["edit-" + res.id]}
                                                >
                                                  {resourceTypes.map((type) => (
                                                    <option key={type} value={type}>
                                                      {type}
                                                    </option>
                                                  ))}
                                                </select>
                                                <input
                                                  type="url"
                                                  placeholder="Lien"
                                                  value={editForm[res.id]?.link ?? res.link}
                                                  onChange={(e) =>
                                                    handleEditFormChange(res.id, "link", e.target.value)
                                                  }
                                                  disabled={actionLoading["edit-" + res.id]}
                                                  style={{ minWidth: "120px" }}
                                                />
                                                <select
                                                  value={editForm[res.id]?.access_type ?? res.access_type}
                                                  onChange={(e) =>
                                                    handleEditFormChange(res.id, "access_type", e.target.value)
                                                  }
                                                  disabled={actionLoading["edit-" + res.id]}
                                                >
                                                  {accessTypes.map((at) => (
                                                    <option key={at.value} value={at.value}>
                                                      {at.label}
                                                    </option>
                                                  ))}
                                                </select>
                                                <button
                                                  className="tc-btn save"
                                                  onClick={() => handleEditResource(res.id, chapter.id)}
                                                  disabled={actionLoading["edit-" + res.id]}
                                                >
                                                  {actionLoading["edit-" + res.id] ? "Mise à jour..." : "Valider"}
                                                </button>
                                                <button
                                                  className="tc-btn cancel"
                                                  onClick={() => setEditOpen(null)}
                                                  disabled={actionLoading["edit-" + res.id]}
                                                >
                                                  Annuler
                                                </button>
                                              </div>
                                            ) : (
                                              <div className="tc-resource-info inline">
                                                <span className="tc-resource-name">{res.name}</span>
                                                <span className="tc-resource-type">{res.resource_type}</span>
                                                <span className="tc-resource-access">
                                                  {res.access_type === "public" ? "🌍" : "🔒"}
                                                </span>
                                                <a className="tc-resource-link" href={res.link} target="_blank" rel="noopener noreferrer">
                                                  Ouvrir
                                                </a>
                                                <button
                                                  className="tc-btn edit"
                                                  onClick={() => {
                                                    setEditForm({
                                                      ...editForm,
                                                      [res.id]: {
                                                        name: res.name,
                                                        resource_type: res.resource_type,
                                                        link: res.link,
                                                        access_type: res.access_type,
                                                      },
                                                    });
                                                    setEditOpen(res.id);
                                                  }}
                                                  disabled={actionLoading["edit-" + res.id]}
                                                >
                                                  Modifier
                                                </button>
                                                <button
                                                  className="tc-btn delete"
                                                  onClick={() => handleDeleteResource(res.id, chapter.id)}
                                                  disabled={actionLoading["delete-" + res.id]}
                                                >
                                                  {actionLoading["delete-" + res.id] ? "Suppression..." : "Supprimer"}
                                                </button>
                                              </div>
                                            )}
                                          </motion.div>
                                        ))
                                      ) : (
                                        <div className="tc-empty">Aucune ressource.</div>
                                      )}
                                    </div>
                                    <div className="tc-add-resource-form inline">
                                      <input
                                        type="text"
                                        placeholder="Nom"
                                        value={addForm[chapter.id]?.name || ""}
                                        onChange={(e) =>
                                          handleAddFormChange(chapter.id, "name", e.target.value)
                                        }
                                        disabled={actionLoading["add-" + chapter.id]}
                                      />
                                      <select
                                        value={addForm[chapter.id]?.resource_type || resourceTypes[0]}
                                        onChange={(e) =>
                                          handleAddFormChange(chapter.id, "resource_type", e.target.value)
                                        }
                                        disabled={actionLoading["add-" + chapter.id]}
                                      >
                                        {resourceTypes.map((type) => (
                                          <option key={type} value={type}>
                                            {type}
                                          </option>
                                        ))}
                                      </select>
                                      <input
                                        type="url"
                                        placeholder="Lien"
                                        value={addForm[chapter.id]?.link || ""}
                                        onChange={(e) =>
                                          handleAddFormChange(chapter.id, "link", e.target.value)
                                        }
                                        disabled={actionLoading["add-" + chapter.id]}
                                        style={{ minWidth: "120px" }}
                                      />
                                      <select
                                        value={addForm[chapter.id]?.access_type || accessTypes[0].value}
                                        onChange={(e) =>
                                          handleAddFormChange(chapter.id, "access_type", e.target.value)
                                        }
                                        disabled={actionLoading["add-" + chapter.id]}
                                      >
                                        {accessTypes.map((at) => (
                                          <option key={at.value} value={at.value}>
                                            {at.label}
                                          </option>
                                        ))}
                                      </select>
                                      <button
                                        className="tc-btn add"
                                        onClick={() => handleAddResource(chapter.id)}
                                        disabled={actionLoading["add-" + chapter.id]}
                                      >
                                        {actionLoading["add-" + chapter.id] ? "Ajout..." : "Ajouter"}
                                      </button>
                                    </div>
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        ))
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default TeacherCourses;
