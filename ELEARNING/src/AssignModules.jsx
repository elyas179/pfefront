import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import "./AssignModules.css";

const AssignModules = () => {
  const navigate = useNavigate();
  const [specialities, setSpecialities] = useState([]);
  const [levels, setLevels] = useState([]);
  const [form, setForm] = useState({ speciality: "", level: "" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    axios.get("http://127.0.0.1:8000/api/courses/specialities/")
      .then(res => {
        const data = Array.isArray(res.data) ? res.data : res.data.results || [];
        setSpecialities(data);
      })
      .catch(err => console.error("Erreur chargement spécialités:", err));
  }, []);

  useEffect(() => {
    if (form.speciality) {
      axios.get(`http://127.0.0.1:8000/api/courses/speciality/${form.speciality}/levels/`)
        .then(res => {
          const data = Array.isArray(res.data.levels) ? res.data.levels : [];
          setLevels(data);
        })
        .catch(err => {
          console.error("Erreur chargement niveaux:", err);
          setLevels([]);
        });
    } else {
      setLevels([]);
    }
  }, [form.speciality]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.speciality || !form.level) {
      alert("Veuillez choisir une spécialité et un niveau.");
      return;
    }
    setLoading(true);
    setMessage("");
    const token = localStorage.getItem("accessToken");

    try {
      await axios.post("http://127.0.0.1:8000/api/users/assign-my-modules/", {
        speciality: parseInt(form.speciality),
        level: parseInt(form.level),
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage("✅ Modules assignés avec succès !");
    } catch (error) {
      console.error("Erreur assignation:", error);
      setMessage("❌ Une erreur est survenue.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="assign-modules-container"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h1>Assigner mes Modules</h1>
      <form onSubmit={handleSubmit} className="assign-form">
        <select name="speciality" value={form.speciality} onChange={handleChange} required>
          <option value="">Choisir une spécialité</option>
          {specialities.map((spec) => (
            <option key={spec.id} value={spec.id}>{spec.name}</option>
          ))}
        </select>

        <select name="level" value={form.level} onChange={handleChange} required disabled={!form.speciality}>
          <option value="">Choisir un niveau</option>
          {levels.map((level) => (
            <option key={level.id} value={level.id}>{level.name}</option>
          ))}
        </select>

        <button type="submit" className="auth-button-filled" disabled={loading}>
          {loading ? "Assignation en cours..." : "Assigner"}
        </button>
      </form>
      {message && <p className="assign-message">{message}</p>}
    </motion.div>
  );
};

export default AssignModules;
