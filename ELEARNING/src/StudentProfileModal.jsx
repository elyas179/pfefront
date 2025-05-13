// ✅ StudentProfileModal.jsx (avec fond flou, sauvegarde backend, upload photo)
import React, { useState } from "react";
import { Dialog } from "primereact/dialog";
import { Avatar } from "primereact/avatar";
import axios from "axios";
import "./StudentProfileModal.css"; // Ajoute ton CSS custom ici

const StudentProfileModal = ({ visible, onHide, user, setUser }) => {
  const [formData, setFormData] = useState({
    bio: user?.bio || "",
    background: user?.background || "",
    profile_photo: user?.profile_photo || null,
  });
  const [photoPreview, setPhotoPreview] = useState(user?.profile_photo);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, profile_photo: file });
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const data = new FormData();
      data.append("bio", formData.bio);
      data.append("background", formData.background);
      if (formData.profile_photo instanceof File) {
        data.append("profile_photo", formData.profile_photo);
      }

      const res = await axios.patch("http://127.0.0.1:8000/api/users/me/edit/", data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setUser(res.data);
      localStorage.setItem("user", JSON.stringify(res.data));
      onHide();
    } catch (err) {
      console.error("Erreur sauvegarde:", err);
    }
  };

  return (
    <Dialog
      header="Modifier mon profil"
      visible={visible}
      onHide={onHide}
      style={{ width: "30rem" }}
      className="student-profile-dialog"
      modal
    >
      <div className="profile-form">
        <label>Bio</label>
        <textarea
          name="bio"
          value={formData.bio}
          onChange={handleChange}
          rows={2}
        />

        <div className="photo-section">
          <label htmlFor="profile-photo-input">
            <Avatar
              image={photoPreview ? `http://127.0.0.1:8000${photoPreview}` : undefined}
              icon={!photoPreview && "pi pi-user"}
              shape="circle"
              size="xlarge"
            />
          </label>
          <input
            id="profile-photo-input"
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleFileChange}
          />
        </div>

        <label>Background</label>
        <textarea
          name="background"
          value={formData.background}
          onChange={handleChange}
          rows={2}
        />

        <div className="student-info-fixed">
          <p><strong>Email :</strong> {user?.email}</p>
          <p><strong>Spécialité :</strong> {user?.speciality || "-"}</p>
          <p><strong>Niveau :</strong> {user?.level || "-"}</p>
        </div>

        <button className="save-btn" onClick={handleSave}>
          Sauvegarder
        </button>
      </div>
    </Dialog>
  );
};

export default StudentProfileModal;
