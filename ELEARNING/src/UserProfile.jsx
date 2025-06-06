import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { ProgressSpinner } from 'primereact/progressspinner';
import { FaFilePdf, FaVideo } from 'react-icons/fa';
import ProfessorAnnouncementList from './components/ProfessorAnnouncementList';
import './UserProfile.css';

const UserProfile = () => {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [resources, setResources] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem('accessToken');
  const currentUserId = localStorage.getItem('userId');

  const headers = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  useEffect(() => {
    if (!id || !token) {
      setError('ID ou token manquant');
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        const [profileRes, resourceRes, followingsRes] = await Promise.all([
          axios.get(`http://127.0.0.1:8000/api/users/profile/${id}/`, headers),
          axios.get(`http://127.0.0.1:8000/api/courses/${id}/resources/`, headers),
          axios.get(`http://127.0.0.1:8000/api/users/my-followings/`, headers),
        ]);

        const userData = profileRes.data.user ?? profileRes.data;
        setProfile(userData);
        setResources(resourceRes.data);

        const isAlreadyFollowing = followingsRes.data.some(f => f.professor_username === userData.username);
        setIsFollowing(isAlreadyFollowing);
      } catch (err) {
        console.error('API error:', err);
        setError("Erreur lors du chargement du profil.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const [followLoading, setFollowLoading] = useState(false); // ← Add this at the top with your useState hooks

const handleFollow = async () => {
  if (!profile?.username) {
    alert("Nom d'utilisateur manquant.");
    return;
  }

  const payload = { professor_username: profile.username };
  const endpoint = isFollowing
    ? 'http://127.0.0.1:8000/api/users/unfollow/'
    : 'http://127.0.0.1:8000/api/users/follow/';

  try {
    setFollowLoading(true);
    console.log("🔁 Sending request to:", endpoint);
    console.log("📦 With payload:", payload);

    const res = await axios.post(endpoint, payload, headers);

    console.log("✅ Response:", res.data);
    setIsFollowing((prev) => !prev);
  } catch (err) {
    console.error("❌ Follow/Unfollow Error:", err);

    if (err.response) {
      console.error("🧠 Backend says:", err.response.data);
      alert(`Erreur: ${err.response.data.detail || 'Action impossible.'}`);
    } else {
      alert("Erreur réseau ou inattendue.");
    }
  } finally {
    setFollowLoading(false);
  }
};


  const getIcon = (type) => {
    if (type.includes('pdf')) return <FaFilePdf color="#ef4444" />;
    if (type.includes('video')) return <FaVideo color="#3b82f6" />;
    return <FaFilePdf />;
  };

  if (loading) return <div className="profile-loader"><ProgressSpinner /></div>;
  if (error) return <div className="profile-error">{error}</div>;
  if (!profile) return <div className="profile-error">Profil introuvable.</div>;

  const isOwn = parseInt(currentUserId) === profile.id;

  return (
    <div className="profile-layout-grid">
      {/* Left Panel */}
      <section className="profile-left">
        <img
          src={profile.profile_photo ? `http://127.0.0.1:8000${profile.profile_photo}` : '/fallback-avatar.png'}
          alt="Profil"
          className="profile-photo-large"
        />
        <h2 className="username-black">{profile.username}</h2>
        <p><strong>Nom:</strong> {profile.first_name} {profile.last_name}</p>
        <p><strong>Type:</strong> {profile.user_type}</p>
        <p><strong>Spécialité:</strong> {profile.speciality?.name || 'Non renseignée'}</p>

        {!isOwn && profile.user_type === 'professor' && (
          <button
          className="follow-btn"
          onClick={handleFollow}
          disabled={followLoading}
        >
          {followLoading
            ? '⏳...'
            : isFollowing
            ? '❌ Désabonner'
            : '➕ Suivre'}
        </button>
        
        )}
      </section>

      {/* Right Panel */}
      <div className="profile-main-content">

        {/* Bio & Parcours Top Grid */}
        <div className="profile-grid-top">
          <section className="profile-card">
            <h3>📝 Bio</h3>
            <p>{profile.bio || 'Non renseignée.'}</p>
          </section>

          <section className="profile-card">
            <h3>🎓 Parcours</h3>
            <p>{profile.background || 'Non renseigné.'}</p>
          </section>
        </div>

        {/* Annonces & Ressources Side by Side */}
        <div className="profile-grid-bottom">
          {profile.user_type === 'professor' && (
            <section className="profile-card half">
              <h3>📢 Annonces du Professeur</h3>
              <ProfessorAnnouncementList professorId={profile.id} />
            </section>
          )}

          <section className="profile-card half">
            <h3>📂 Ressources partagées</h3>
            {resources.length > 0 ? (
              <ul className="resource-list">
                {resources.map((res) => (
                  <li key={res.id} className="resource-item">
                    {getIcon(res.resource_type)} {res.name}
                    <span className="resource-meta">
                      {new Date(res.created_at).toLocaleDateString()} • {res.access_type === 'public' ? '🔓 Public' : '🔒 Privé'}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p>Aucune ressource disponible.</p>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
