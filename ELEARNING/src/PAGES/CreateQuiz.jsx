import React, { useState, useEffect } from "react";
import axios from "axios";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { InputSwitch } from "primereact/inputswitch";
import "./CreateQuiz.css";

const CreateQuiz = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState("");
  const [type, setType] = useState("qcm");
  const [creationMode] = useState("manual");
  const [moduleId, setModuleId] = useState(null);
  const [chapterId, setChapterId] = useState(null);
  const [modules, setModules] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [message, setMessage] = useState("");
  const token = localStorage.getItem("accessToken");

  useEffect(() => {
    axios.get("http://127.0.0.1:8000/api/courses/modules/", {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((res) => {
      const data = res.data;
      if (Array.isArray(data)) setModules(data);
      else if (Array.isArray(data.results)) setModules(data.results);
      else setModules([]);
    })
    .catch((err) => {
      console.error("Erreur lors du chargement des modules:", err);
      setModules([]);
    });
  }, [token]);

  useEffect(() => {
    if (moduleId) {
      axios.get(`http://127.0.0.1:8000/api/courses/chapters/?module=${moduleId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const data = res.data;
        if (Array.isArray(data)) setChapters(data);
        else if (Array.isArray(data.results)) setChapters(data.results);
        else setChapters([]);
      })
      .catch((err) => {
        console.error("Erreur lors du chargement des chapitres:", err);
        setChapters([]);
      });
    }
  }, [moduleId, token]);

  const addQuestion = () => {
    setQuestions([...questions, { text: "", answers: [{ text: "", is_correct: false }] }]);
  };

  const addAnswer = (qIndex) => {
    const updated = [...questions];
    updated[qIndex].answers.push({ text: "", is_correct: false });
    setQuestions(updated);
  };

  const handleQuestionChange = (qIndex, value) => {
    const updated = [...questions];
    updated[qIndex].text = value;
    setQuestions(updated);
  };

  const handleAnswerChange = (qIndex, aIndex, key, value) => {
    const updated = [...questions];
    updated[qIndex].answers[aIndex][key] = value;
    setQuestions(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!moduleId) {
      setMessage("❌ Veuillez sélectionner un module.");
      return;
    }

    const quizPayload = {
      title,
      description,
      duration: parseInt(duration),
      type,
      module: moduleId,
      chapter: chapterId || null,
      creation_mode: creationMode,
    };

    try {
      const quizRes = await axios.post("http://127.0.0.1:8000/api/quizzes/", quizPayload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const quizId = quizRes.data.id;

      for (const q of questions) {
        const questionRes = await axios.post(`http://127.0.0.1:8000/api/quizzes/${quizId}/questions/`, { text: q.text }, {
          headers: { Authorization: `Bearer ${token}` },
        });

        for (const a of q.answers) {
          await axios.post(`http://127.0.0.1:8000/api/quizzes/${quizId}/questions/${questionRes.data.id}/answers/`, a, {
            headers: { Authorization: `Bearer ${token}` },
          });
        }
      }

      setMessage("✅ Quiz created with questions!");
      setTitle(""); setDescription(""); setDuration(""); setModuleId(null); setChapterId(null); setQuestions([]);
    } catch (error) {
      console.error(error);
      setMessage("❌ Failed to create quiz.");
    }
  };

  return (
    <div className="create-quiz-wrapper">
      <Card title="Créer un Nouveau Quiz" className="quiz-main-card">
        <form onSubmit={handleSubmit} className="quiz-form">
          <div className="form-section">
            <h4>Informations de Base</h4>
            <div className="form-grid">
              <InputText placeholder="Titre" value={title} onChange={(e) => setTitle(e.target.value)} />
              <InputTextarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} rows={3} />
              <InputText type="number" placeholder="Durée (min)" value={duration} onChange={(e) => setDuration(e.target.value)} />
              <Dropdown value={type} options={[{ label: "QCM", value: "qcm" }, { label: "Réponse Libre", value: "free" }]} onChange={(e) => setType(e.value)} placeholder="Type" />
              <Dropdown value={moduleId} options={modules.map((m) => ({ label: m.name, value: m.id }))} onChange={(e) => setModuleId(e.value)} placeholder="Module" />
              <Dropdown value={chapterId} options={chapters.map((c) => ({ label: c.name, value: c.id }))} onChange={(e) => setChapterId(e.value)} placeholder="Chapitre (optionnel)" />
            </div>
          </div>

          <div className="form-section">
            <h4>Questions & Réponses</h4>
            {questions.map((q, qIndex) => (
              <Card key={qIndex} className="question-card">
                <InputTextarea value={q.text} onChange={(e) => handleQuestionChange(qIndex, e.target.value)} rows={2} placeholder={`Question ${qIndex + 1}`} />
                {q.answers.map((a, aIndex) => (
                  <div className="answer-row" key={aIndex}>
                    <InputText value={a.text} onChange={(e) => handleAnswerChange(qIndex, aIndex, "text", e.target.value)} placeholder={`Réponse ${aIndex + 1}`} />
                    <label>
                      <InputSwitch checked={a.is_correct} onChange={(e) => handleAnswerChange(qIndex, aIndex, "is_correct", e.value)} /> Correcte
                    </label>
                  </div>
                ))}
                <Button type="button" label="Ajouter une réponse" onClick={() => addAnswer(qIndex)} className="add-answer-btn" />
              </Card>
            ))}
            <Button type="button" label="Ajouter une question" onClick={addQuestion} className="add-question-btn" />
          </div>

          <Button type="submit" label="Créer le Quiz" className="submit-btn" />
          {message && <p className="quiz-message">{message}</p>}
        </form>
      </Card>
    </div>
  );
};

export default CreateQuiz;
