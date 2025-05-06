// ✅ StudentQuizzes.jsx (Full width layout)
import React, { useEffect, useState } from "react";
import axios from "axios";
import "./StudentQuizzes.css";

const StudentQuizzes = () => {
  const token = localStorage.getItem("accessToken");
  const [quizzes, setQuizzes] = useState([]);
  const [modules, setModules] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [formData, setFormData] = useState({ module: "", chapters: [], difficulty: 3, quiz_type: "qcm" });

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
      alert("✅ Quiz g\u00e9n\u00e9r\u00e9 !");
      setFormData({ module: "", chapters: [], difficulty: 3, quiz_type: "qcm" });
    }).catch(() => alert("Erreur lors de la g\u00e9n\u00e9ration."));
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

  if (selectedQuiz) {
    return (
      <div className="quiz-page full">
        <h1>{selectedQuiz.title}</h1>
        {currentQuestion && !showResults && (
          <div className="quiz-question">
            <h2>{currentQuestion.text}</h2>
            <ul>
              {currentQuestion.answers.map((ans) => (
                <li
                  key={ans.id}
                  className={selectedAnswer === ans.id ? "selected" : ""}
                  onClick={() => setSelectedAnswer(ans.id)}
                >
                  {ans.text}
                </li>
              ))}
            </ul>
            <button onClick={submitAnswer} disabled={selectedAnswer === null}>
              {currentIndex + 1 < selectedQuiz.questions.length ? "Suivant" : "Terminer"}
            </button>
          </div>
        )}
        {showResults && (
          <div className="quiz-results">
            <h2>✅ Quiz termin\u00e9 !</h2>
            <p>Score : {score} / {selectedQuiz.questions.length}</p>
            <button onClick={resetQuiz}>Retour</button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="quiz-page">
      <h1 className="quiz-title">🧠 Plateforme de Quiz</h1>
      <div className="quiz-sections">
        <div className="quiz-pass">
          <h2>📘 Passer un quiz</h2>
          {quizzes.map((q) => (
            <div key={q.id} className="quiz-entry">
              <div className="quiz-info">
                <strong>{q.title}</strong>
                <p>{q.module || "Module inconnu"}</p>
              </div>
              <button onClick={() => startQuiz(q.id)}>▶ Commencer</button>
            </div>
          ))}
        </div>

        <div className="quiz-generate">
          <h2>✨ G\u00e9n\u00e9rer un quiz</h2>
          <select value={formData.module} onChange={(e) => handleModuleSelect(e.target.value)}>
            <option value="">Choisir un module</option>
            {modules.map((mod) => (
              <option key={mod.id} value={mod.id}>{mod.name}</option>
            ))}
          </select>

          <div className="quiz-chapters">
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

          <label>Difficult\u00e9 (1 \u00e0 5):
            <input
              type="number"
              min={1}
              max={5}
              value={formData.difficulty}
              onChange={(e) => setFormData({ ...formData, difficulty: parseInt(e.target.value) })}
            />
          </label>

          <label>Type de quiz :
            <select
              value={formData.quiz_type}
              onChange={(e) => setFormData({ ...formData, quiz_type: e.target.value })}
            >
              <option value="qcm">QCM</option>
              <option value="free">Libre</option>
            </select>
          </label>

          <button onClick={submitGeneration}>G\u00e9n\u00e9rer</button>
        </div>
      </div>
    </div>
  );
};

export default StudentQuizzes;
