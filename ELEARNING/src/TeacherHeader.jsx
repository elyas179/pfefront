import axios from "axios";
import { Dialog } from "primereact/dialog";
import { FileUpload } from "primereact/fileupload";
import { OverlayPanel } from "primereact/overlaypanel";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import React, { useEffect, useRef, useState } from "react";
import { FaBell } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "./TeacherHeader.css";

const TeacherHeader = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [notifications, setNotifications] = useState([]);
  const [modalPhotoVisible, setModalPhotoVisible] = useState(false);
  const [modalProfileVisible, setModalProfileVisible] = useState(false);
  const [editForm, setEditForm] = useState({ bio: "", background: "" });
  const [darkMode, setDarkMode] = useState(false);
  const [loadingSearch, setLoadingSearch] = useState(false);

  const profileOp = useRef(null);
  const notifOp = useRef(null);
  const toast = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) return;

    axios.get("http://127.0.0.1:8000/api/users/me/", {
      headers: { Authorization: `Bearer ${token}` },
    }).then((res) => {
      setUser(res.data);
      setEditForm({
        bio: res.data.bio || "",
        background: res.data.background || ""
      });
    });

    axios.get("http://127.0.0.1:8000/api/notifications/", {
      headers: { Authorization: `Bearer ${token}` },
    }).then((res) => setNotifications(res.data));
  }, []);

  useEffect(() => {
    document.body.className = darkMode ? "dark-mode" : "light-mode";
  }, [darkMode]);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("accessToken");
      await axios.patch("http://127.0.0.1:8000/api/users/me/edit/", editForm, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const res = await axios.get("http://127.0.0.1:8000/api/users/me/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(res.data);
      toast.current.show({ severity: "success", summary: "Succès", detail: "Profil mis à jour !" });
      setModalProfileVisible(false);
    } catch {
      toast.current.show({ severity: "error", summary: "Erreur", detail: "Échec modification." });
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e) => {
    const file = e.files[0];
    const formData = new FormData();
    formData.append("profile_photo", file);
    try {
      const token = localStorage.getItem("accessToken");
      await axios.patch("http://127.0.0.1:8000/api/users/me/edit/", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      const res = await axios.get("http://127.0.0.1:8000/api/users/me/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(res.data);
      toast.current.show({ severity: "success", summary: "Succès", detail: "Photo mise à jour !" });
      setModalPhotoVisible(false);
    } catch {
      toast.current.show({ severity: "error", summary: "Erreur", detail: "Échec envoi photo." });
    }
  };

  const handleDeletePhoto = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      await axios.patch("http://127.0.0.1:8000/api/users/me/edit/", {
        profile_photo: null
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const res = await axios.get("http://127.0.0.1:8000/api/users/me/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(res.data);
      toast.current.show({ severity: "success", summary: "Supprimée", detail: "Photo supprimée." });
      setModalPhotoVisible(false);
    } catch {
      toast.current.show({ severity: "error", summary: "Erreur", detail: "Erreur suppression." });
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setLoadingSearch(true);
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.get(`http://127.0.0.1:8000/search/?q=${searchQuery}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      localStorage.setItem("searchResults", JSON.stringify(response.data));
      localStorage.setItem("searchQuery", searchQuery);
      setTimeout(() => {
        setLoadingSearch(false);
        navigate("/teacher-search-results");
        navigate(0);
      }, 1000);
    } catch (err) {
      setLoadingSearch(false);
      console.error("Erreur recherche:", err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <header className="teacher-header">
      <Toast ref={toast} />
      <div className="teacher-header-left">
        <img
          src="/logo.png"
          alt="Logo"
          className="teacher-logo"
          style={{ cursor: "pointer" }}
          onClick={() => {
            const user = JSON.parse(localStorage.getItem("user"));
            if (user?.user_type === "professor") {
              navigate("/teacher");
            } else {
              navigate("/student");
            }
          }}
        />
        <span className="teacher-title">Curio Prof</span>
        <Button
          icon="pi pi-home"
          label="Accueil"
          className="accueil-button"
          onClick={() => {
            const user = JSON.parse(localStorage.getItem("user"));
            if (user?.user_type === "professor") {
              navigate("/teacher");
            } else {
              navigate("/student");
            }
          }}
        />
      </div>

      <div className="teacher-header-center">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="🔍 Rechercher..."
          className="search-input"
        />
        <button className="search-button" onClick={handleSearch}>Rechercher</button>
      </div>

      <div className="teacher-header-right">
        <div className="notif-wrapper">
          <div className="notif-icon" onClick={(e) => notifOp.current.toggle(e)}>
            <FaBell />
            {notifications.length > 0 && <span className="notif-dot">{notifications.length}</span>}
          </div>
          <OverlayPanel ref={notifOp} className="overlay-panel-custom">
            <ul className="overlay-options">
              {notifications.length > 0 ? notifications.map((notif, i) => (
                <li key={i}>{notif.message}</li>
              )) : <li>Aucune notification</li>}
            </ul>
          </OverlayPanel>
        </div>

        {user && (
          <div className="profile-container" onClick={(e) => profileOp.current.toggle(e)}>
            <img
              src={`http://127.0.0.1:8000${user.profile_photo}`}
              alt="Profil"
              className="profile-preview-small"
            />
            <span className="profile-username">{user.username}</span>
          </div>
        )}

        <OverlayPanel ref={profileOp} className="overlay-panel-custom">
          {user && (
            <div>
              <div className="overlay-user-info">
                <img src={`http://127.0.0.1:8000${user.profile_photo}`} alt="Profil" className="overlay-profile-img" />
                <strong>{user.username}</strong>
                <small>{user.speciality?.name || "Professeur"}</small>
              </div>
              <ul className="overlay-links">
                <li onClick={() => navigate(`/teacher-profile/${user.id}/edit`)}>⚙️  Profil</li>
                <li onClick={() => setModalPhotoVisible(true)}>🖼️ Changer Photo</li>
                <li onClick={() => setDarkMode(!darkMode)}>{darkMode ? "☀️ Mode clair" : "🌙 Mode sombre"}</li>
                <li onClick={handleLogout}>🚪 Déconnexion</li>
              </ul>
            </div>
          )}
        </OverlayPanel>
      </div>

      <Dialog header="Changer la photo" visible={modalPhotoVisible} style={{ width: "30vw" }} onHide={() => setModalPhotoVisible(false)}>
        {user?.profile_photo && (
          <div className="photo-preview-container">
            <img src={`http://127.0.0.1:8000${user.profile_photo}`} alt="Preview" className="profile-preview" />
            <button className="delete-button" onClick={handleDeletePhoto}>Supprimer</button>
          </div>
        )}
        <FileUpload
          name="profile_photo"
          customUpload
          uploadHandler={handleUpload}
          accept="image/*"
          mode="basic"
          auto
          chooseLabel={loading ? "Chargement..." : "Téléverser"}
          disabled={loading}
        />
      </Dialog>

      <Dialog header="Modifier mon profil" visible={modalProfileVisible} style={{ width: "30vw" }} onHide={() => setModalProfileVisible(false)}>
        <div className="edit-profile-form">
          <label>Bio</label>
          <textarea name="bio" value={editForm.bio} onChange={handleProfileChange} rows={3} />
          <label>Background</label>
          <textarea name="background" value={editForm.background} onChange={handleProfileChange} rows={3} />
          <button onClick={handleSaveProfile} className="auth-button-filled" disabled={loading}>
            {loading ? "Sauvegarde..." : "Sauvegarder"}
          </button>
        </div>
      </Dialog>
    </header>
  );
};

export default TeacherHeader;
