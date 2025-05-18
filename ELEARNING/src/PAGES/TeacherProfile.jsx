import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./TeacherProfile.css";

export default function EditProfile() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    bio: "",
    background: "",
    profile_photo: null,
    speciality: "",
    level: ""
  });

  const [initialData, setInitialData] = useState({});
  const [preview, setPreview] = useState(null);
  const [success, setSuccess] = useState(false);
  const token = localStorage.getItem("accessToken");

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    axios
      .get("http://127.0.0.1:8000/api/users/me/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        const data = res.data;
        setFormData({
          username: data.username || "",
          email: data.email || "",
          password: "",
          bio: data.bio || "",
          background: data.background || "",
          profile_photo: null,
          speciality: data.speciality || "",
          level: data.level || ""
        });
        setInitialData(data);
        setPreview(`http://127.0.0.1:8000${data.profile_photo}`);
      })
      .catch((err) => {
        console.error("Erreur utilisateur :", err);
        navigate("/login");
      });
  }, [navigate, token]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "profile_photo") {
      const file = files[0];
      setFormData({ ...formData, profile_photo: file });
      setPreview(URL.createObjectURL(file));
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value && key !== "speciality" && key !== "level") {
        data.append(key, value);
      }
    });

    try {
      await axios.patch("http://127.0.0.1:8000/api/users/me/edit/", data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      setSuccess(true);
    } catch (error) {
      console.error("Erreur lors de la mise à jour :", error);
    }
  };

  return (
    <div className="editpage-full">
      <h1>Mon Profil</h1>

      <div className="editpage-info">
        <img
          src={preview || "/default-avatar.png"}
          alt="Photo de profil"
          className="editpage-avatar"
        />
        <p><strong>Nom d'utilisateur :</strong> {initialData.username}</p>
        <p><strong>Email :</strong> {initialData.email}</p>
        <p><strong>Bio :</strong> {initialData.bio}</p>
        <p><strong>Background :</strong> {initialData.background}</p>
        <p><strong>Spécialité :</strong> {initialData.speciality}</p>
        <p><strong>Niveau :</strong> {initialData.level}</p>
      </div>

      <hr className="editpage-separator" />

      <h2>Modifier mes informations</h2>
      <form onSubmit={handleSubmit} className="editpage-form-plain">
        <label>Nouvelle photo de profil :</label>
        <input type="file" name="profile_photo" accept="image/*" onChange={handleChange} />

        <label>Nom d'utilisateur</label>
        <input type="text" name="username" value={formData.username} onChange={handleChange} />

        <label>Email</label>
        <input type="email" name="email" value={formData.email} onChange={handleChange} />

        <label>Mot de passe</label>
        <input type="password" name="password" placeholder="Laisser vide si inchangé" onChange={handleChange} />

        <label>Bio</label>
        <textarea name="bio" value={formData.bio} onChange={handleChange} rows="3" />

        <label>Background</label>
        <input type="text" name="background" value={formData.background} onChange={handleChange} />

        <label>Spécialité (verrouillée)</label>
        <input type="text" value={formData.speciality} disabled />

        <label>Niveau (verrouillé)</label>
        <input type="text" value={formData.level} disabled />

        <button type="submit">Enregistrer</button>
      </form>

      {success && <div className="editpage-success">✅ Profil mis à jour</div>}
    </div>
  );
}
