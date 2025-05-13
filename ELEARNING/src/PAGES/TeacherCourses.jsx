import React, { useEffect, useState } from 'react'
import axios from 'axios'
import './TeacherCourses.css'

const TeacherCourses = () => {
  const token = localStorage.getItem('accessToken')
  const axiosConfig = { headers: { Authorization: `Bearer ${token}` } }

  const [resources, setResources] = useState([])
  const [chapters, setChapters] = useState([])
  const [editingId, setEditingId] = useState(null)
  const [editForm, setEditForm] = useState({
    name: '',
    link: '',
    resource_type: 'cours-pdf',
    access_type: 'public',
    chapter: ''
  })

  const [addForm, setAddForm] = useState({
    name: '',
    link: '',
    resource_type: 'cours-pdf',
    access_type: 'public',
    chapter: ''
  })

  useEffect(() => {
    fetchResources()
    fetchChapters()
  }, [])

  const fetchResources = async () => {
    try {
      const res = await axios.get('http://127.0.0.1:8000/api/courses/resources/my/', axiosConfig)
      setResources(res.data)
    } catch {
      alert('Erreur de chargement des ressources.')
    }
  }

  const fetchChapters = async () => {
    try {
      const res = await axios.get('http://127.0.0.1:8000/api/courses/chapters/', axiosConfig)
      setChapters(res.data)
    } catch {
      alert('Erreur de chargement des chapitres.')
    }
  }

  const startEdit = (res) => {
    const chapterId = typeof res.chapter === 'object' ? res.chapter?.id : res.chapter
    setEditingId(res.id)
    setEditForm({
      name: res.name || '',
      link: res.link || '',
      resource_type: res.resource_type || 'cours-pdf',
      access_type: res.access_type || 'public',
      chapter: chapterId?.toString() || ''
    })
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditForm({
      name: '',
      link: '',
      resource_type: 'cours-pdf',
      access_type: 'public',
      chapter: ''
    })
  }

  const handleEditChange = (field, value) => {
    setEditForm((prev) => ({
      ...prev,
      [field]: value
    }))
  }

  const submitEdit = async () => {
    const { name, link, chapter } = editForm
    if (!name?.trim() || !link?.trim() || !chapter) {
      alert('Champs manquants')
      return
    }

    try {
      await axios.patch(
        `http://127.0.0.1:8000/api/courses/resources/${editingId}/edit/`,
        {
          ...editForm,
          chapter: parseInt(chapter, 10)
        },
        axiosConfig
      )
      cancelEdit()
      fetchResources()
    } catch (err) {
      console.error(err)
      alert('Erreur lors de la mise à jour.')
    }
  }

  const submitAdd = async () => {
    const { name, link, chapter } = addForm
    if (!name?.trim() || !link?.trim() || !chapter) {
      alert('Champs obligatoires manquants')
      return
    }

    try {
      await axios.post('http://127.0.0.1:8000/api/courses/resources/', {
        ...addForm,
        chapter: parseInt(chapter, 10)
      }, axiosConfig)
      setAddForm({
        name: '',
        link: '',
        resource_type: 'cours-pdf',
        access_type: 'public',
        chapter: ''
      })
      fetchResources()
    } catch (err) {
      console.error(err)
      alert('Erreur lors de la création.')
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer cette ressource ?')) return
    try {
      await axios.delete(`http://127.0.0.1:8000/api/courses/resources/${id}/delete/`, axiosConfig)
      fetchResources()
    } catch {
      alert('Erreur lors de la suppression.')
    }
  }

  return (
    <div className="teacher-course-page">
      <h1 className="teacher-course-title">📚 Gestion des Ressources</h1>

      <section className="resource-list-section">
        <h2 className="section-title">🗂️ Mes Ressources</h2>
        <ul className="resource-list">
          {resources.map((res) => (
            <li key={res.id} className="resource-item">
              {editingId === res.id ? (
                <div className="edit-form">
                  <input
                    value={editForm.name}
                    onChange={(e) => handleEditChange('name', e.target.value)}
                    placeholder="Nom"
                  />
                  <input
                    value={editForm.link}
                    onChange={(e) => handleEditChange('link', e.target.value)}
                    placeholder="Lien"
                  />
                  <select value={editForm.resource_type} onChange={(e) => handleEditChange('resource_type', e.target.value)}>
                    <option value="cours-pdf">Cours PDF</option>
                    <option value="cours-video">Cours Vidéo</option>
                    <option value="td-pdf">TD PDF</option>
                    <option value="td-video">TD Vidéo</option>
                    <option value="tp-pdf">TP PDF</option>
                    <option value="tp-video">TP Vidéo</option>
                  </select>
                  <select value={editForm.access_type} onChange={(e) => handleEditChange('access_type', e.target.value)}>
                    <option value="public">Public</option>
                    <option value="private">Privé</option>
                  </select>
                  <select value={editForm.chapter} onChange={(e) => handleEditChange('chapter', e.target.value)}>
                    <option value="">Sélectionner un chapitre</option>
                    {chapters.map((ch) => (
                      <option key={ch.id} value={ch.id}>{ch.name}</option>
                    ))}
                  </select>
                  <div className="form-actions">
                    <button onClick={submitEdit}>💾 Sauvegarder</button>
                    <button onClick={cancelEdit}>❌ Annuler</button>
                  </div>
                </div>
              ) : (
                <div className="resource-card">
                  <div>
                    <strong>{res.name}</strong>
                    <p>{res.resource_type} • {res.access_type}</p>
                    <a href={res.link} target="_blank" rel="noreferrer">📎 Lien</a>
                  </div>
                  <div className="resource-actions">
                    <button onClick={() => startEdit(res)}>✏️ Modifier</button>
                    <button onClick={() => handleDelete(res.id)}>🗑️ Supprimer</button>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      </section>

      <section className="resource-create-section">
        <h2 className="section-title">➕ Ajouter une Ressource</h2>
        <div className="create-form">
          <input value={addForm.name} onChange={(e) => setAddForm({ ...addForm, name: e.target.value })} placeholder="Nom" />
          <input value={addForm.link} onChange={(e) => setAddForm({ ...addForm, link: e.target.value })} placeholder="Lien" />
          <select value={addForm.resource_type} onChange={(e) => setAddForm({ ...addForm, resource_type: e.target.value })}>
            <option value="cours-pdf">Cours PDF</option>
            <option value="cours-video">Cours Vidéo</option>
            <option value="td-pdf">TD PDF</option>
            <option value="td-video">TD Vidéo</option>
            <option value="tp-pdf">TP PDF</option>
            <option value="tp-video">TP Vidéo</option>
          </select>
          <select value={addForm.access_type} onChange={(e) => setAddForm({ ...addForm, access_type: e.target.value })}>
            <option value="public">Public</option>
            <option value="private">Privé</option>
          </select>
          <select value={addForm.chapter} onChange={(e) => setAddForm({ ...addForm, chapter: e.target.value })}>
            <option value="">Sélectionner un chapitre</option>
            {chapters.map((ch) => (
              <option key={ch.id} value={ch.id}>{ch.name}</option>
            ))}
          </select>
          <button onClick={submitAdd}>✅ Ajouter</button>
        </div>
      </section>
    </div>
  )
}

export default TeacherCourses
