import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import './StudentProfessors.css'

const StudentProfessors = () => {
  const [professors, setProfessors] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const token = localStorage.getItem('accessToken')

  const headers = {
    headers: { Authorization: `Bearer ${token}` }
  }

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/users/professors/', headers)
      .then(res => setProfessors(res.data))
      .catch(err => console.error('Erreur chargement:', err))
      .finally(() => setLoading(false))
  }, [])

  const goToProfile = (id) => {
    navigate(`/profile/${id}`)
  }

  if (loading) {
    return (
      <div className="professors-page">
        <h1 className="professors-title">👩‍🏫 Nos Professeurs</h1>
        <p className="professors-loading">Chargement...</p>
      </div>
    )
  }

  if (!professors.length) {
    return (
      <div className="professors-page">
        <h1 className="professors-title">👩‍🏫 Nos Professeurs</h1>
        <p className="professors-empty">Aucun professeur trouvé.</p>
      </div>
    )
  }

  return (
    <div className="professors-page">
      <h1 className="professors-title">👩‍🏫 Nos Professeurs</h1>
      <div className="professor-grid">
        {professors.map(prof => (
          <div
            key={prof.id}
            className="professor-card"
            onClick={() => goToProfile(prof.id)}
          >
            <img
              src={prof.profile_photo ? `http://127.0.0.1:8000${prof.profile_photo}` : '/fallback-avatar.png'}
              alt="Professeur"
              className="professor-avatar"
              onError={(e) => {
                e.target.src = '/fallback-avatar.png'
              }}
            />
            <div className="professor-info">
              <strong>{prof.username}</strong>
              <span>{prof.speciality?.name || 'Spécialité inconnue'}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default StudentProfessors
