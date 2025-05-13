import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import "./UserProfile.css";
import ProfessorAnnouncementList from './components/ProfessorAnnouncementList';

const UserProfile = () => {
  const { id } = useParams()
  const [profile, setProfile] = useState(null)
  const [isFollowing, setIsFollowing] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  const token = localStorage.getItem('accessToken')
  const currentUserId = localStorage.getItem('userId')

  const headers = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }

  useEffect(() => {
    if (!id || !token) {
      setError('ID ou token manquant');
      setLoading(false); // ✅ FIX: don't forget this
      return;
    }
  
    const fetchData = async () => {
      try {
        const res = await axios.get(`http://127.0.0.1:8000/api/users/profile/${id}/`, headers);
        console.log("✅ API response:", res.data);
        const userData = res.data.user ? res.data.user : res.data;
        setProfile(userData);
        setIsFollowing(res.data.is_following ?? false);
      } catch (err) {
        console.error('❌ API error:', err);
        setError("Erreur lors du chargement du profil.");
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
  }, [id]);
  

  const handleFollow = async () => {
    try {
      await axios.post(`http://127.0.0.1:8000/api/users/${id}/follow/`, {}, headers)
      setIsFollowing(prev => !prev)
    } catch (err) {
      console.error('Erreur follow:', err)
      alert("Impossible de suivre/désabonner.")
    }
  }

  if (loading) return <div className="profile-page">Chargement...</div>
  if (error) return <div className="profile-page error-msg">{error}</div>
  if (!profile) return <div className="profile-page error-msg">Profil introuvable.</div>

  const isOwn = parseInt(currentUserId) === profile.id

  return (
    <div className="profile-page">
      <div className="profile-header">
        <img
          src={profile.profile_photo ? `http://127.0.0.1:8000${profile.profile_photo}` : '/fallback-avatar.png'}
          alt="Photo de profil"
          className="profile-avatar"
        />
        <div className="profile-info">
          <h2>{profile.username}</h2>
          <p><strong>Type:</strong> {profile.user_type}</p>
          <p><strong>Spécialité:</strong> {profile.speciality?.name || 'Non renseignée'}</p>

          {!isOwn && profile.user_type === 'professor' && (
            <button className="follow-btn" onClick={handleFollow}>
              {isFollowing ? '✅ Abonné' : '➕ Suivre'}
            </button>
          )}
        </div>
      </div>

      <div className="profile-body">
        {profile.bio && (
          <>
            <h3>📝 Bio</h3>
            <p>{profile.bio}</p>
          </>
        )}

        {profile.background && (
          <>
            <h3>🎓 Parcours</h3>
            <p>{profile.background}</p>
          </>
        )}

        {/* 🔥 Show professor announcements */}
        {profile.user_type === 'professor' && (
          <div style={{ marginTop: '2rem' }}>
            <h3>📢 Annonces du Professeur</h3>
            <ProfessorAnnouncementList professorId={profile.id} />
          </div>
        )}
      </div>
    </div>
  )
}

export default UserProfile
