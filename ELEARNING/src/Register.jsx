import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import "./AuthForm.css";

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'etudiant',
    speciality: '',
    level: '',
  });

  const [levels, setLevels] = useState([]);
  const [specialities, setSpecialities] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔁 Remove tokens just in case
  useEffect(() => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  }, []);

  // 🔁 Load levels & specialities
  useEffect(() => {
    axios.get('http://127.0.0.1:8000/courses/levels/')
      .then(res => {
        const data = Array.isArray(res.data) ? res.data : res.data.results || [];
        setLevels(data);
      })
      .catch(err => console.error('❌ Erreur niveaux:', err));

    axios.get('http://127.0.0.1:8000/courses/specialities/')
      .then(res => {
        const data = Array.isArray(res.data) ? res.data : res.data.results || [];
        setSpecialities(data);
      })
      .catch(err => console.error('❌ Erreur spécialités:', err));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "role") {
      setFormData({ ...formData, role: value, level: '', speciality: '' });
    } else if (name === "speciality") {
      setFormData({ ...formData, speciality: value, level: '' });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (formData.password !== formData.confirmPassword) {
      alert("❗Les mots de passe ne correspondent pas !");
      setLoading(false);
      return;
    }

    if (formData.role === 'etudiant' && (!formData.speciality || !formData.level)) {
      alert("❗Veuillez sélectionner la spécialité et le niveau.");
      setLoading(false);
      return;
    }

    const payload = {
      first_name: formData.first_name,
      last_name: formData.last_name,
      username: formData.username,
      email: formData.email,
      password: formData.password,
      user_type: formData.role === "etudiant" ? "student" : "professor"
    };

    if (formData.role === "etudiant") {
      payload.speciality = parseInt(formData.speciality);
      payload.level = parseInt(formData.level);
    }

    try {
      const response = await axios.post('http://127.0.0.1:8000/api/users/register/', payload);
      setSuccessMessage("✅ Inscription réussie ! Connecte-toi maintenant.");
    } catch (error) {
      console.error("❌ Erreur d'inscription :", error.response?.data || error.message);
      alert("Erreur : " + JSON.stringify(error.response?.data));
    } finally {
      setLoading(false);
    }
  };

  const selectedSpeciality = specialities.find(s => String(s.id) === formData.speciality);
  const specialityName = selectedSpeciality?.name.toLowerCase() || '';
  const availableLevels = levels.filter(level =>
    specialityName.includes("tronc") ? level.name.startsWith("L1") : level.name.startsWith("L2")
  );

  return (
    <motion.div
      className="auth-container"
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.5 }}
    >
      <div className="auth-left">
        <h1>Bienvenue !</h1>
        <p>Crée ton compte pour commencer</p>
        <button className="auth-button-outlined" onClick={() => navigate('/login')}>
          Se connecter
        </button>
      </div>

      <div className="auth-right">
        <h2>Inscription</h2>
        {successMessage && <p className="success-message">{successMessage}</p>}
        <form onSubmit={handleSubmit}>
          <input type="text" name="first_name" placeholder="Prénom" value={formData.first_name} onChange={handleChange} required />
          <input type="text" name="last_name" placeholder="Nom" value={formData.last_name} onChange={handleChange} required />
          <input type="text" name="username" placeholder="Nom d'utilisateur" value={formData.username} onChange={handleChange} required />
          <input type="email" name="email" placeholder="Adresse email" value={formData.email} onChange={handleChange} required />
          <input type="password" name="password" placeholder="Mot de passe" value={formData.password} onChange={handleChange} required />
          <input type="password" name="confirmPassword" placeholder="Confirmer le mot de passe" value={formData.confirmPassword} onChange={handleChange} required />

          <div className="role-select">
            <label>
              <input type="radio" name="role" value="etudiant" checked={formData.role === 'etudiant'} onChange={handleChange} />
              Étudiant
            </label>
            <label>
              <input type="radio" name="role" value="professeur" checked={formData.role === 'professeur'} onChange={handleChange} />
              Professeur
            </label>
          </div>

          {formData.role === "etudiant" && (
            <>
              <select name="speciality" value={formData.speciality} onChange={handleChange} required>
                <option value="">Choisir une spécialité</option>
                {specialities.map(spec => (
                  <option key={spec.id} value={spec.id}>{spec.name}</option>
                ))}
              </select>

              {formData.speciality && (
                <select name="level" value={formData.level} onChange={handleChange} required>
                  <option value="">Choisir un niveau</option>
                  {availableLevels.map(level => (
                    <option key={level.id} value={level.id}>{level.name}</option>
                  ))}
                </select>
              )}
            </>
          )}

          <button
            className="auth-button-filled"
            type="submit"
            disabled={loading}
          >
            {loading ? "Création de votre profil..." : "S'inscrire"}
          </button>
        </form>
      </div>
    </motion.div>
  );
};

export default Register;
