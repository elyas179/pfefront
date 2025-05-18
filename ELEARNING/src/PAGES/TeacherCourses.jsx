import React, { useEffect, useState } from "react";
import axios from "axios";
import "./TeacherCourses.css";

const TeacherCourses = () => {
  const [modules, setModules] = useState([]);
  const [expandedModule, setExpandedModule] = useState(null);
  const [expandedChapter, setExpandedChapter] = useState(null);
  const [editingChapterId, setEditingChapterId] = useState(null);
  const [chapterName, setChapterName] = useState("");
  const [resources, setResources] = useState([]);
  const [editResourceId, setEditResourceId] = useState(null);
  const [resourceEdits, setResourceEdits] = useState({});
  const [newResource, setNewResource] = useState({
    name: "",
    link: "",
    chapter: null,
    resource_type: "cours-pdf",
    access_type: "public",
  });

  const [loadingAction, setLoadingAction] = useState("");

  const token = localStorage.getItem("accessToken");

  useEffect(() => {
    if (!token) return;
    axios
      .get("http://127.0.0.1:8000/api/users/choosemodules/", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setModules(res.data || []))
      .catch(() => setModules([]));
  }, [token]);

  const toggleModule = (id) => {
    setExpandedModule(expandedModule === id ? null : id);
    setExpandedChapter(null);
    setResources([]);
  };

  const toggleChapter = (chapter) => {
    const chapterId = chapter.id;
    setEditingChapterId(null);
    setExpandedChapter(expandedChapter === chapterId ? null : chapterId);

    if (expandedChapter !== chapterId) {
      axios
        .get("http://127.0.0.1:8000/api/courses/resources/my/", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          const list = res.data || [];
          setResources(list.filter((r) => r.chapter === chapterId));
        })
        .catch(() => setResources([]));
    }
  };

  const handleChapterEdit = (chapter) => {
    setEditingChapterId(chapter.id);
    setChapterName(chapter.name);
  };

  const saveChapterName = async (id) => {
    setLoadingAction("saving");
    try {
      await axios.patch(
        `http://127.0.0.1:8000/api/courses/chapters/${id}/edit-name/`,
        { name: chapterName },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const updatedModules = modules.map((mod) => ({
        ...mod,
        chapters: mod.chapters.map((chap) =>
          chap.id === id ? { ...chap, name: chapterName } : chap
        ),
      }));
      setModules(updatedModules);
      setEditingChapterId(null);
    } catch (err) {
      console.error("Erreur nom chapitre:", err);
    } finally {
      setLoadingAction("");
    }
  };

  const handleResourceChange = (id, field, value) => {
    setResourceEdits((prev) => ({
      ...prev,
      [id]: { ...prev[id], [field]: value },
    }));
  };

  const saveResourceEdit = async (id) => {
    setLoadingAction("saving");
    try {
      await axios.patch(
        `http://127.0.0.1:8000/api/courses/resources/${id}/edit/`,
        resourceEdits[id],
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setEditResourceId(null);
    } catch (err) {
      console.error("Erreur édition ressource:", err);
    } finally {
      setLoadingAction("");
    }
  };

  const deleteResource = async (id) => {
    setLoadingAction("deleting");
    try {
      await axios.delete(
        `http://127.0.0.1:8000/api/courses/resources/${id}/delete/`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setResources((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      console.error("Erreur suppression ressource:", err);
    } finally {
      setLoadingAction("");
    }
  };

  const addResource = async () => {
    const { name, link, chapter, resource_type, access_type } = newResource;
    if (!name || !link || !chapter) return;

    setLoadingAction("adding");
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/courses/resources/",
        { name, link, chapter, resource_type, access_type },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const added = response.data;
      setResources((prev) => [...prev, added]);
      setNewResource({
        name: "",
        link: "",
        chapter: chapter,
        resource_type: "cours-pdf",
        access_type: "public",
      });
    } catch (err) {
      console.error("Erreur ajout ressource:", err);
    } finally {
      setLoadingAction("");
    }
  };

  return (
    <div className="teacher-courses-container">
      <h1 className="teacher-courses-title">👨‍🏫 Mes Modules Enseignés</h1>
      <div className="modules-list">
        {modules.map((mod) => (
          <div key={mod.id} className="module-block">
            <div
              className="module-title"
              onClick={() => toggleModule(mod.id)}
            >
              {mod.name}
              <span className="arrow">{expandedModule === mod.id ? "▲" : "▼"}</span>
            </div>
            {expandedModule === mod.id && (
              <div className="chapters-section">
                {mod.chapters.map((chap) => (
                  <div key={chap.id} className="chapter-block">
                    <div className="chapter-header">
                      {editingChapterId === chap.id ? (
                        <>
                          <input
                            value={chapterName}
                            onChange={(e) => setChapterName(e.target.value)}
                          />
                          <button onClick={() => saveChapterName(chap.id)}>
                            {loadingAction === "saving" ? "💾 Saving..." : "💾"}
                          </button>
                        </>
                      ) : (
                        <span onClick={() => toggleChapter(chap)}>
                          {chap.name}
                          <span className="arrow">{expandedChapter === chap.id ? "▲" : "▼"}</span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleChapterEdit(chap);
                            }}
                          >
                            ✏️
                          </button>
                        </span>
                      )}
                    </div>

                    {expandedChapter === chap.id && (
                      <div className="resources-section">
                        {resources.map((res) => (
                          <div key={res.id} className="resource-item">
                            {editResourceId === res.id ? (
                              <>
                                <input
                                  value={resourceEdits[res.id]?.name || res.name}
                                  onChange={(e) =>
                                    handleResourceChange(res.id, "name", e.target.value)
                                  }
                                />
                                <input
                                  value={resourceEdits[res.id]?.link || res.link}
                                  onChange={(e) =>
                                    handleResourceChange(res.id, "link", e.target.value)
                                  }
                                />
                                <select
                                  value={resourceEdits[res.id]?.resource_type || res.resource_type}
                                  onChange={(e) =>
                                    handleResourceChange(res.id, "resource_type", e.target.value)
                                  }
                                >
                                  <option value="cours-pdf">Cours PDF</option>
                                  <option value="cours-video">Cours Vidéo</option>
                                  <option value="td-pdf">TD PDF</option>
                                  <option value="td-video">TD Vidéo</option>
                                  <option value="tp-pdf">TP PDF</option>
                                  <option value="tp-video">TP Vidéo</option>
                                </select>
                                <select
                                  value={resourceEdits[res.id]?.access_type || res.access_type}
                                  onChange={(e) =>
                                    handleResourceChange(res.id, "access_type", e.target.value)
                                  }
                                >
                                  <option value="public">Public</option>
                                  <option value="private">Privé</option>
                                </select>
                                <button onClick={() => saveResourceEdit(res.id)}>
                                  {loadingAction === "saving" ? "💾 Saving..." : "💾"}
                                </button>
                              </>
                            ) : (
                              <>
                                <span>{res.name}</span>
                                <button onClick={() => setEditResourceId(res.id)}>✏️</button>
                                <button onClick={() => deleteResource(res.id)}>
                                  {loadingAction === "deleting" ? "🗑️ Deleting..." : "🗑️"}
                                </button>
                              </>
                            )}
                          </div>
                        ))}

                        <div className="resource-item add-resource-form">
                          <input
                            type="text"
                            placeholder="Nom"
                            value={newResource.chapter === chap.id ? newResource.name : ""}
                            onChange={(e) =>
                              setNewResource((prev) => ({
                                ...prev,
                                name: e.target.value,
                                chapter: chap.id,
                              }))
                            }
                          />
                          <input
                            type="url"
                            placeholder="Lien"
                            value={newResource.chapter === chap.id ? newResource.link : ""}
                            onChange={(e) =>
                              setNewResource((prev) => ({
                                ...prev,
                                link: e.target.value,
                                chapter: chap.id,
                              }))
                            }
                          />
                          <select
                            value={newResource.chapter === chap.id ? newResource.resource_type : "cours-pdf"}
                            onChange={(e) =>
                              setNewResource((prev) => ({
                                ...prev,
                                resource_type: e.target.value,
                                chapter: chap.id,
                              }))
                            }
                          >
                            <option value="cours-pdf">Cours PDF</option>
                            <option value="cours-video">Cours Vidéo</option>
                            <option value="td-pdf">TD PDF</option>
                            <option value="td-video">TD Vidéo</option>
                            <option value="tp-pdf">TP PDF</option>
                            <option value="tp-video">TP Vidéo</option>
                          </select>
                          <select
                            value={newResource.chapter === chap.id ? newResource.access_type : "public"}
                            onChange={(e) =>
                              setNewResource((prev) => ({
                                ...prev,
                                access_type: e.target.value,
                                chapter: chap.id,
                              }))
                            }
                          >
                            <option value="public">Public</option>
                            <option value="private">Privé</option>
                          </select>
                          <button onClick={addResource}>
                            {loadingAction === "adding" ? "➕ Adding..." : "➕"}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeacherCourses;
