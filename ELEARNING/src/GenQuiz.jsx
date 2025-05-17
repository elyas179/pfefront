import React, { useEffect, useState } from "react";
import axios from "axios";
import "./GenQuiz.css";
import { Button } from "primereact/button";
import { useNavigate } from "react-router-dom";

const GenQuiz = () => {
  const token = localStorage.getItem("accessToken");
  const navigate = useNavigate();

  const [modules, setModules] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [formData, setFormData] = useState({
    module: "",
    chapters: [],
    difficulty: 3,
    quiz_type: "qcm",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/courses/modules/", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setModules(res.data))
      .catch(() => setModules([]));
  }, [token]);

  useEffect(() => {
    if (formData.module) {
      axios
        .get(`http://127.0.0.1:8000/api/courses/modules/${formData.module}/`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => setChapters(res.data.chapters || []))
        .catch(() => setChapters([]));
    } else {
      setChapters([]);
    }
  }, [formData.module, token]);

  const toggleChapter = (id) => {
    const updated = formData.chapters.includes(id)
      ? formData.chapters.filter((ch) => ch !== id)
      : [...formData.chapters, id];
    setFormData({ ...formData, chapters: updated });
  };

  const handleSubmit = () => {
    if (!formData.module || formData.chapters.length === 0) {
      alert("❌ Choisissez un module et au moins un chapitre.");
      return;
    }
    setLoading(true);
    axios
      .post("http://127.0.0.1:8000/api/ai/genquizzes/", formData, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        alert("✅ Quiz généré avec succès !");
        setFormData({ module: "", chapters: [], difficulty: 3, quiz_type: "qcm" });
        setChapters([]);
        navigate("/quizzes/play");
      })
      .catch(() => alert("Erreur lors de la génération du quiz."))
      .finally(() => setLoading(false));
  };

  return (
    <div className="genquiz-container no-header">
      <h2 className="genquiz-title">✨ Générer un Quiz</h2>
      <div className="genquiz-form">
        <label>Module</label>
        <select
          value={formData.module}
          onChange={(e) => setFormData({ ...formData, module: e.target.value, chapters: [] })}
        >
          <option value="">Choisir un module</option>
          {modules.map((mod) => (
            <option key={mod.id} value={mod.id}>
              {mod.name}
            </option>
          ))}
        </select>

        {chapters.length > 0 && (
          <>
            <label>Chapitres</label>
            <div className="chapter-checkboxes">
              {chapters.map((ch) => (
                <label key={ch.id}>
                  <input
                    type="checkbox"
                    checked={formData.chapters.includes(ch.id)}
                    onChange={() => toggleChapter(ch.id)}
                  />
                  {ch.name}
                </label>
              ))}
            </div>
          </>
        )}

        <label>Difficulté (1 à 5)</label>
        <input
          type="number"
          min={1}
          max={5}
          value={formData.difficulty}
          onChange={(e) => setFormData({ ...formData, difficulty: parseInt(e.target.value) })}
        />

        <label>Type de quiz</label>
        <select
          value={formData.quiz_type}
          onChange={(e) => setFormData({ ...formData, quiz_type: e.target.value })}
        >
          <option value="qcm">QCM</option>
          <option value="free">Réponse libre</option>
        </select>

        <Button
          label={loading ? "Création du quiz..." : "Générer le Quiz"}
          onClick={handleSubmit}
          disabled={loading}
          className="genquiz-btn"
        />
      </div>
    </div>
  );
};

export default GenQuiz;
