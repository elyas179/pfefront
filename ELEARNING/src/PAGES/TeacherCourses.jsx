import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './TeacherCourses.css';
import { Dropdown } from 'primereact/dropdown';

const fixLink = (link) => {
  if (!link || typeof link !== "string") return null;
  if (link.startsWith("file://")) return null;
  let fixedLink = link;
  if (!/^https?:\/\//.test(fixedLink)) {
    fixedLink = "https://" + fixedLink;
  }
  const match = fixedLink.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)\//);
  if (match && match[1]) {
    return `https://drive.google.com/uc?export=preview&id=${match[1]}`;
  }
  return fixedLink;
};

const TeacherCourses = () => {
  const token = localStorage.getItem('accessToken');
  const axiosConfig = { headers: { Authorization: `Bearer ${token}` } };

  const [levels, setLevels] = useState([]);
  const [specialities, setSpecialities] = useState([]);
  const [modules, setModules] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [resources, setResources] = useState([]);

  const [selectedLevel, setSelectedLevel] = useState('');
  const [selectedSpeciality, setSelectedSpeciality] = useState('');
  const [selectedModule, setSelectedModule] = useState('');
  const [selectedChapter, setSelectedChapter] = useState(null);

  const [formData, setFormData] = useState({
    resourceName: '',
    link: '',
    resource_type: 'cours-pdf',
    access_type: 'public'
  });

  const [editMode, setEditMode] = useState(false);
  const [editResourceId, setEditResourceId] = useState(null);

  // Chapitre edit state
  const [editChapterMode, setEditChapterMode] = useState(false);
  const [chapterNewName, setChapterNewName] = useState('');

  useEffect(() => {
    fetchLevels();
    fetchResources();
  }, []);

  useEffect(() => {
    if (selectedLevel) fetchSpecialities();
  }, [selectedLevel]);

  useEffect(() => {
    if (selectedLevel && selectedSpeciality) fetchModules();
  }, [selectedLevel, selectedSpeciality]);

  useEffect(() => {
    if (selectedModule) fetchChapters();
  }, [selectedModule]);

  const fetchLevels = async () => {
    const res = await axios.get('http://127.0.0.1:8000/api/courses/levels/');
    setLevels(res.data);
  };

  const fetchSpecialities = async () => {
    const res = await axios.get('http://127.0.0.1:8000/courses/specialities/');
    const filtered = res.data.filter(s => s.levels.some(l => l.id === parseInt(selectedLevel)));
    setSpecialities(filtered);
  };

  const fetchModules = async () => {
    const res = await axios.get('http://127.0.0.1:8000/api/courses/modules/', axiosConfig);
    const filtered = res.data.filter(m => m.level === parseInt(selectedLevel) && m.speciality === parseInt(selectedSpeciality));
    setModules(filtered);
  };

  const fetchChapters = async () => {
    const res = await axios.get('http://127.0.0.1:8000/api/courses/chapters/', axiosConfig);
    const filtered = res.data.filter(ch => ch.module === parseInt(selectedModule));
    setChapters(filtered);
    setSelectedChapter(filtered[0] || null);
  };

  const fetchResources = async () => {
    const res = await axios.get('http://127.0.0.1:8000/api/courses/resources/my/', axiosConfig);
    setResources(res.data);
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!selectedModule || !formData.resourceName || !formData.link || !selectedChapter) {
      return alert("Veuillez remplir tous les champs.");
    }
    const fixedLink = fixLink(formData.link);
    if (!fixedLink) {
      return alert("Veuillez saisir un lien valide commençant par http(s)://");
    }
    try {
      await axios.post('http://127.0.0.1:8000/api/courses/resources/', {
        name: formData.resourceName,
        link: fixedLink,
        resource_type: formData.resource_type,
        access_type: formData.access_type,
        chapter: selectedChapter.id
      }, axiosConfig);
      resetForm();
      fetchResources();
      alert("✅ Ressource ajoutée");
    } catch (err) {
      alert("Erreur ajout ressource");
    }
  };

  const resetForm = () => {
    setFormData({
      resourceName: '',
      link: '',
      resource_type: 'cours-pdf',
      access_type: 'public'
    });
    setEditMode(false);
    setEditResourceId(null);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer cette ressource ?")) return;
    await axios.delete(`http://127.0.0.1:8000/api/courses/resources/${id}/delete/`, axiosConfig);
    fetchResources();
  };

  const handleEdit = (resource) => {
    setEditMode(true);
    setEditResourceId(resource.id);
    setFormData({
      resourceName: resource.name,
      link: resource.link,
      resource_type: resource.resource_type,
      access_type: resource.access_type
    });
    const chapter = chapters.find(ch => ch.id === resource.chapter);
    setSelectedChapter(chapter || null);
  };

  const submitEdit = async () => {
    try {
      await axios.patch(`http://127.0.0.1:8000/api/courses/resources/${editResourceId}/edit/`, {
        name: formData.resourceName,
        link: formData.link,
        resource_type: formData.resource_type,
        access_type: formData.access_type,
        chapter: selectedChapter.id
      }, axiosConfig);
      resetForm();
      fetchResources();
    } catch {
      alert("Erreur mise à jour ressource");
    }
  };

  const handleChapterRename = async () => {
    if (!chapterNewName.trim()) return alert("Nom invalide.");
    try {
      const res = await axios.patch(
        `http://127.0.0.1:8000/api/courses/chapters/${selectedChapter.id}/edit-name/`,
        { name: chapterNewName },
        axiosConfig
      );
  
      const updatedName = res.data.name;
  
      // Recharge la liste des chapitres
      await fetchChapters();
  
      // Mets à jour le chapitre sélectionné avec le nouveau nom
      setSelectedChapter(prev => ({
        ...prev,
        name: updatedName
      }));
  
      alert("✅ Chapitre renommé !");
      setEditChapterMode(false);
    } catch (err) {
      alert("❌ Erreur lors de la mise à jour.");
    }
  };
  
  return (
    <div className="teacher-course-page">
      <h1 className="teacher-course-title">Gestion des Cours</h1>

      <div className="create-form">
        <select value={selectedLevel} onChange={e => setSelectedLevel(e.target.value)}>
          <option value=''>-- Niveau --</option>
          {levels.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
        </select>

        <select value={selectedSpeciality} onChange={e => setSelectedSpeciality(e.target.value)}>
          <option value=''>-- Spécialité --</option>
          {specialities.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>

        <select value={selectedModule} onChange={e => setSelectedModule(e.target.value)}>
          <option value=''>-- Module --</option>
          {modules.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
        </select>

        <div className="chapter-edit-container">
  {editChapterMode ? (
    <>
      <input
        className="chapter-rename-input"
        value={chapterNewName}
        onChange={(e) => setChapterNewName(e.target.value)}
      />
      <button className="save-chapter-btn" onClick={handleChapterRename}>💾</button>
      <button className="cancel-chapter-btn" onClick={() => setEditChapterMode(false)}>❌</button>
    </>
  ) : (
    <>
      <Dropdown
        value={selectedChapter}
        options={chapters}
        onChange={(e) => setSelectedChapter(e.value)}
        optionLabel="name"
        placeholder="-- Chapitre --"
        className="p-dropdown-rounded"
      />
      {selectedChapter && (
        <button
          className="edit-chapter-btn"
          title="Renommer chapitre"
          onClick={() => {
            setChapterNewName(selectedChapter.name);
            setEditChapterMode(true);
          }}
        >
          ✏️
        </button>
      )}
    </>
  )}
</div>


        <input type="text" value={formData.resourceName} onChange={e => handleChange('resourceName', e.target.value)} placeholder="Nom de la ressource" />
        <input type="text" value={formData.link} onChange={e => handleChange('link', e.target.value)} placeholder="Lien" />

        <select value={formData.resource_type} onChange={e => handleChange('resource_type', e.target.value)}>
          <option value="cours-pdf">Cours PDF</option>
          <option value="cours-video">Cours Vidéo</option>
          <option value="td-pdf">TD PDF</option>
          <option value="td-video">TD Vidéo</option>
          <option value="tp-pdf">TP PDF</option>
          <option value="tp-video">TP Vidéo</option>
        </select>

        <select value={formData.access_type} onChange={e => handleChange('access_type', e.target.value)}>
          <option value="public">Public</option>
          <option value="private">Privé</option>
        </select>

        <button onClick={editMode ? submitEdit : handleSubmit}>
          {editMode ? '💾 Sauvegarder' : '➕ Ajouter Ressource'}
        </button>
      </div>

      <div className="resource-list">
        <h2 className="section-title">📁 Mes Ressources</h2>
        <ul>
          {resources.map(r => (
            <li key={r.id} className="resource-item">
              <div className="resource-info">
                <strong>{r.name}</strong> — {r.resource_type}<br />
                {(() => {
                  const fixed = fixLink(r.link);
                  return fixed ? (
                    <a href={fixed} target="_blank" rel="noopener noreferrer" className="resource-link">📎 Lien</a>
                  ) : (
                    <span className="invalid-link">⚠️ Lien invalide</span>
                  );
                })()}
              </div>
              <div className="resource-actions">
                <button onClick={() => handleEdit(r)}>✏️</button>
                <button onClick={() => handleDelete(r.id)}>🗑️</button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default TeacherCourses;
