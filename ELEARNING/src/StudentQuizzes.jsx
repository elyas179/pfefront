import React, { useEffect, useState } from "react";
import axios from "axios";
import "./StudentQuizzes.css";

const Quizzes = () => {
  const token = localStorage.getItem("accessToken");

  const [quizzes, setQuizzes] = useState([]);
  const [modules, setModules] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);

  const [formData, setFormData] = useState({
    module: "",
    chapters: [],
    difficulty: 3,
    quiz_type: "qcm",
  });

  useEffect(() => {
    axios.get("http://127.0.0.1:8000/api/quizzes/", {
      headers: { Authorization: `Bearer ${token}` },
    }).then((res) => setQuizzes(res.data));

    axios.get("http://127.0.0.1:8000/api/courses/modules/", {
      headers: { Authorization: `Bearer ${token}` },
    }).then((res) => setModules(res.data));
  }, []);

  const handleModuleSelect = (id) => {
    setFormData({ ...formData, module: id, chapters: [] });
    axios.get(`http://127.0.0.1:8000/api/courses/modules/${id}/`, {
      headers: { Authorization: `Bearer ${token}` },
    }).then((res) => setChapters(res.data.chapters));
  };

  const toggleChapter = (id) => {
    const updated = formData.chapters.includes(id)
      ? formData.chapters.filter((ch) => ch !== id)
      : [...formData.chapters, id];
    setFormData({ ...formData, chapters: updated });
  };

  const submitGeneration = () => {
    if (!formData.module || formData.chapters.length === 0) {
      alert("Choisissez un module et au moins un chapitre.");
      return;
    }

    axios.post("http://127.0.0.1:8000/api/ai/genquizzes/", formData, {
      headers: { Authorization: `Bearer ${token}` },
    }).then(() => {
      alert("✅ Quiz généré !");
      setFormData({ module: "", chapters: [], difficulty: 3, quiz_type: "qcm" });
    }).catch(() => alert("Erreur lors de la génération."));
  };

  const startQuiz = (id) => {
    axios.get(`http://127.0.0.1:8000/api/quizzes/${id}/`, {
      headers: { Authorization: `Bearer ${token}` },
    }).then((res) => {
      setSelectedQuiz(res.data);
      setCurrentIndex(0);
      setSelectedAnswer(null);
      setScore(0);
      setShowResults(false);
    });
  };

  const currentQuestion = selectedQuiz?.questions?.[currentIndex];

  const submitAnswer = () => {
    const correct = currentQuestion.answers.find((a) => a.is_correct);
    if (selectedAnswer === correct.id) setScore(score + 1);

    if (currentIndex + 1 < selectedQuiz.questions.length) {
      setCurrentIndex(currentIndex + 1);
      setSelectedAnswer(null);
    } else {
      setShowResults(true);
    }
  };

  const resetQuiz = () => {
    setSelectedQuiz(null);
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setScore(0);
    setShowResults(false);
  };

  // If quiz selected, full-page quiz mode
  if (selectedQuiz) {
    return (
      <div className="quiz-play-page full-quiz">
        <h1 className="quiz-title">{selectedQuiz.title}</h1>

        {currentQuestion && !showResults && (
          <div className="quiz-question-block">
            <h2 className="question-title">
              {currentIndex + 1}. {currentQuestion.text}
            </h2>
            <ul className="answer-list">
              {currentQuestion.answers.map((ans) => (
                <li
                  key={ans.id}
                  className={`answer-option ${selectedAnswer === ans.id ? "selected" : ""}`}
                  onClick={() => setSelectedAnswer(ans.id)}
                >
                  {ans.text}
                </li>
              ))}
            </ul>
            <button
              className="quiz-next-btn"
              onClick={submitAnswer}
              disabled={selectedAnswer === null}
            >
              {currentIndex + 1 < selectedQuiz.questions.length ? "Suivant" : "Terminer"}
            </button>
          </div>
        )}

        {showResults && (
          <div className="quiz-results">
            <h2>✅ Quiz terminé !</h2>
            <p>Score : {score} / {selectedQuiz.questions.length}</p>
            <button className="quiz-start-btn" onClick={resetQuiz}>Retour</button>
          </div>
        )}
      </div>
    );
  }

  // Default layout: Quiz list + Generation form
  return (
    <div className="quiz-play-page">
      <h1 className="quiz-title">🧠 Plateforme de Quiz</h1>
      <div className="section-container">
        <div className="left-section">
          <h2 className="quiz-list-title">📘 Passer un quiz</h2>
          <ul className="quiz-list">
            {quizzes.map((q) => (
              <li key={q.id} className="quiz-item">
                <div className="quiz-info">
                  <strong>{q.title}</strong>
                  <span>{q.module || "Module inconnu"}</span>
                </div>
                <button className="quiz-start-btn" onClick={() => startQuiz(q.id)}>
                  ▶ Commencer
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="right-section">
          <h2 className="quiz-list-title">✨ Générer un quiz</h2>
          <div className="generate-form">
            <select value={formData.module} onChange={(e) => handleModuleSelect(e.target.value)}>
              <option value="">Choisir un module</option>
              {modules.map((mod) => (
                <option key={mod.id} value={mod.id}>{mod.name}</option>
              ))}
            </select>

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

            <div className="form-group">
              <label>Difficulté (1 à 5):</label>
              <input
                type="number"
                min={1}
                max={5}
                value={formData.difficulty}
                onChange={(e) =>
                  setFormData({ ...formData, difficulty: parseInt(e.target.value) })
                }
              />
            </div>

            <div className="form-group">
              <label>Type de quiz :</label>
              <select
                value={formData.quiz_type}
                onChange={(e) => setFormData({ ...formData, quiz_type: e.target.value })}
              >
                <option value="qcm">QCM</option>
                <option value="free">Réponse libre</option>
              </select>
            </div>

            <button onClick={submitGeneration} className="quiz-start-btn">
              Générer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Quizzes;
