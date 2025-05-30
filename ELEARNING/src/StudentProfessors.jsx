import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './StudentProfessors.css';

const StudentProfessors = () => {
  const [professors, setProfessors] = useState([]);
  const [myFollowings, setMyFollowings] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const token = localStorage.getItem('accessToken');

  const headers = {
    headers: { Authorization: `Bearer ${token}` },
  };

  const fetchProfessors = async (query = '') => {
    try {
      setLoading(true);
      const res = await axios.get(`http://127.0.0.1:8000/api/users/search/professors/?q=${query}`, headers);
      setProfessors(res.data);
    } catch (err) {
      console.error('Erreur chargement des professeurs:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMyFollowings = async () => {
    try {
      const res = await axios.get('http://127.0.0.1:8000/api/users/my-followings/', headers);
      setMyFollowings(res.data);
    } catch (err) {
      console.error('Erreur chargement des suivis:', err);
    }
  };

  const handleFollow = async (username) => {
    try {
      await axios.post('http://127.0.0.1:8000/api/users/follow/', { professor_username: username }, headers);
      fetchMyFollowings();
    } catch (err) {
      console.error('Erreur lors du follow:', err);
    }
  };

  const handleUnfollow = async (username) => {
    try {
      await axios.post('http://127.0.0.1:8000/api/users/unfollow/', { professor_username: username }, headers);
      fetchMyFollowings();
    } catch (err) {
      console.error('Erreur lors du unfollow:', err);
    }
  };

  useEffect(() => {
    fetchProfessors();
    fetchMyFollowings();
  }, []);

  const goToProfile = (id) => {
    navigate(`/profile/${id}`);
  };

  const isFollowing = (username) => myFollowings.some(p => p.professor_username === username);

  const getProfessorByUsername = (username) => professors.find(p => p.username === username);

  return (
    <div className="professors-page">
      <h1 className="professors-title">👩‍🏫 Nos Enseignants</h1>

      <div className="search-followings-container">
        <div className="followings-list">
          <h2>📌 Mes Enseignants Suivis</h2>
          {myFollowings.length > 0 ? (
            <ul>
              {myFollowings.map(follow => {
                const prof = getProfessorByUsername(follow.professor_username);
                return (
                  <li key={follow.id} className="followed-professor-item-simple">
                    <div className="followed-text-block" onClick={() => prof && goToProfile(prof.id)}>
                      <strong>{follow.professor_username}</strong>
                      <p>{prof?.first_name || ''} {prof?.last_name || ''}</p>
                    </div>
                    <button
                      className="unfollow-btn aligned"
                      onClick={() => handleUnfollow(follow.professor_username)}
                    >
                      Se désabonner
                    </button>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p>Aucun professeur suivi.</p>
          )}
        </div>

        <div className="search-bar-wrapper">
          <input
            type="text"
            placeholder="Rechercher un professeur..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              fetchProfessors(e.target.value);
            }}
            className="professor-search"
          />
        </div>
      </div>

      {loading ? (
        <p className="professors-loading">Chargement...</p>
      ) : (
        <div className="professor-grid">
          {professors.map(prof => (
            <div key={prof.id} className="professor-card">
              <img
                src={prof.profile_photo ? `http://127.0.0.1:8000${prof.profile_photo}` : '/fallback-avatar.png'}
                alt="Professeur"
                className="professor-avatar"
                onClick={() => goToProfile(prof.id)}
                onError={(e) => {
                  e.target.src = '/fallback-avatar.png';
                }}
              />
              <div className="professor-info">
                <strong>{prof.username}</strong>
                <span>{prof.speciality?.name || 'Spécialité inconnue'}</span>
                <button
                  className={isFollowing(prof.username) ? 'unfollow-btn' : 'follow-btn'}
                  onClick={() => isFollowing(prof.username)
                    ? handleUnfollow(prof.username)
                    : handleFollow(prof.username)}
                >
                  {isFollowing(prof.username) ? 'Se désabonner' : 'Suivre'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentProfessors;
