// File: GenerateQuizForm.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Dropdown } from "primereact/dropdown";
import { InputNumber } from "primereact/inputnumber";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { useRef } from "react";
import "./StudentQuizzes.css";

const GenerateQuizForm = () => {
  const [modules, setModules] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [selectedModule, setSelectedModule] = useState(null);
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [difficulty, setDifficulty] = useState(3);
  const [quizType, setQuizType] = useState("standard");
  const toast = useRef(null);

  const token = localStorage.getItem("accessToken");

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/courses/modules/")
      .then((res) => setModules(res.data))
      .catch((err) => console.error("Erreur chargement modules:", err));
  }, []);

  useEffect(() => {
    if (selectedModule) {
      axios
        .get(`http://127.0.0.1:8000/api/courses/chapters/?module=${selectedModule}`)
        .then((res) => setChapters(res.data))
        .catch((err) => console.error("Erreur chargement chapitres:", err));
    }
  }, [selectedModule]);

  const handleSubmit = () => {
    if (!selectedModule || !selectedChapter || !difficulty || !quizType) {
      toast.current.show({ severity: "warn", summary: "Champs manquants", detail: "Veuillez remplir tous les champs." });
      return;
    }

    axios
      .post(
        "http://127.0.0.1:8000/api/ai/genquizzes/",
        {
          module: selectedModule,
          chapters: [selectedChapter],
          difficulty: difficulty,
          quiz_type: quizType,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then((res) => {
        toast.current.show({ severity: "success", summary: "Succès", detail: "Quiz généré avec succès!" });
      })
      .catch((err) => {
        toast.current.show({ severity: "error", summary: "Erreur", detail: "La génération a échoué." });
        console.error("Erreur lors de la génération:", err);
      });
  };

  return (
    <div className="generate-quiz-form">
      <Toast ref={toast} />
      <h2>Générer un Quiz par IA</h2>

      <div className="form-field">
        <label>Module:</label>
        <Dropdown
          value={selectedModule}
          options={modules.map((m) => ({ label: m.name, value: m.id }))}
          onChange={(e) => setSelectedModule(e.value)}
          placeholder="Choisissez un module"
        />
      </div>

      <div className="form-field">
        <label>Chapitre:</label>
        <Dropdown
          value={selectedChapter}
          options={chapters.map((c) => ({ label: c.name, value: c.id }))}
          onChange={(e) => setSelectedChapter(e.value)}
          placeholder="Choisissez un chapitre"
          disabled={!selectedModule}
        />
      </div>

      <div className="form-field">
        <label>Difficulté (1-5):</label>
        <InputNumber
          value={difficulty}
          onValueChange={(e) => setDifficulty(e.value)}
          min={1}
          max={5}
        />
      </div>

      <div className="form-field">
        <label>Type de Quiz:</label>
        <Dropdown
          value={quizType}
          options={[
            { label: "Standard", value: "standard" },
            { label: "Challenge", value: "challenge" },
          ]}
          onChange={(e) => setQuizType(e.value)}
        />
      </div>

      <Button label="Générer le Quiz" className="quiz-button" onClick={handleSubmit} />
    </div>
  );
};

export default GenerateQuizForm;
