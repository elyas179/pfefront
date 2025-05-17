import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaChevronDown, FaChevronUp, FaBook, FaPlay, FaCheckCircle } from "react-icons/fa";
import "./PlayQuiz.css";

const PlayQuiz = () => {
  const token = localStorage.getItem("accessToken");
  const navigate = useNavigate();
  const [modules, setModules] = useState([]);
  const [expandedModules, setExpandedModules] = useState({});
  const [quizzesByModule, setQuizzesByModule] = useState({});
  const [loadingModule, setLoadingModule] = useState(null);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [recentQuizId, setRecentQuizId] = useState(null);

  useEffect(() => {
    const recent = localStorage.getItem("recentQuizId");
    if (recent) setRecentQuizId(parseInt(recent));

    axios
      .get("http://127.0.0.1:8000/api/courses/modules/", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setModules(res.data))
      .catch((err) => console.error("Erreur modules:", err));
  }, [token]);

  const toggleModule = async (moduleId) => {
    const isExpanding = !expandedModules[moduleId];
    setExpandedModules((prev) => ({ ...prev, [moduleId]: isExpanding }));

    if (isExpanding && !quizzesByModule[moduleId]) {
      setLoadingModule(moduleId);
      try {
        const res = await axios.get(
          `http://127.0.0.1:8000/api/quizzes/filtered/?module=${moduleId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setQuizzesByModule((prev) => ({ ...prev, [moduleId]: res.data }));
      } catch (err) {
        console.error("Erreur chargement quizzes:", err);
      }
      setLoadingModule(null);
    }
  };

  const startQuiz = (quizId) => {
    axios
      .get(`http://127.0.0.1:8000/api/quizzes/${quizId}/`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setSelectedQuiz(res.data);
        setCurrentIndex(0);
        setSelectedAnswers({});
        setScore(0);
        setShowResults(false);
        setHasSubmitted(false);
      });
  };

  const currentQuestion = selectedQuiz?.questions?.[currentIndex];

  const submitAnswer = async () => {
    const newSelected = { ...selectedAnswers, [currentQuestion.id]: selectedAnswers[currentQuestion.id] };
    setSelectedAnswers(newSelected);

    if (currentIndex + 1 < selectedQuiz.questions.length) {
      setCurrentIndex(currentIndex + 1);
    } else {
      const totalCorrect = selectedQuiz.questions.reduce((acc, q) => {
        const correct = q.answers.filter((a) => a.is_correct).map((a) => a.id).sort().toString();
        const selected = selectedAnswers[q.id] ? [selectedAnswers[q.id]].sort().toString() : "";
        return correct === selected ? acc + 1 : acc;
      }, 0);

      if (!hasSubmitted) {
        try {
          const selectedAnswerIds = Object.values(selectedAnswers).filter((id) => typeof id === "number");
          await axios.post(
            `http://127.0.0.1:8000/api/quizzes/submissions/create/`,
            {
              quiz: selectedQuiz.id,
              selected_answers: selectedAnswerIds,
            },
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          setScore(totalCorrect);
          setHasSubmitted(true);
        } catch (err) {
          console.error("Erreur de soumission:", err.response?.data || err.message);
        }
      }

      setShowResults(true);
    }
  };

  const resetQuiz = () => {
    setSelectedQuiz(null);
    setCurrentIndex(0);
    setSelectedAnswers({});
    setScore(0);
    setShowResults(false);
    setHasSubmitted(false);
  };

  if (selectedQuiz) {
    return (
      <div className="quiz-play-page full-quiz-mode">
        <h1 className="quiz-title">🎯 {selectedQuiz.title}</h1>

        {currentQuestion && !showResults && (
          <div className="quiz-question-block">
            <h2 className="question-title">
              {currentIndex + 1}. {currentQuestion.text}
            </h2>
            <ul className="answer-list">
              {currentQuestion.answers.map((ans) => (
                <li
                  key={ans.id}
                  className={`answer-option ${selectedAnswers[currentQuestion.id] === ans.id ? "selected" : ""}`}
                  onClick={() =>
                    setSelectedAnswers((prev) => ({ ...prev, [currentQuestion.id]: ans.id }))
                  }
                >
                  {ans.text}
                </li>
              ))}
            </ul>
            <button
              className="quiz-next-btn"
              onClick={submitAnswer}
              disabled={selectedAnswers[currentQuestion.id] == null}
            >
              {currentIndex + 1 < selectedQuiz.questions.length ? "Suivant" : "Terminer"}
            </button>
          </div>
        )}

        {showResults && (
          <div className="quiz-results">
            <FaCheckCircle className="result-icon" />
            <h2>✅ Quiz terminé !</h2>
            <p>Score : {score} / {selectedQuiz.questions.length}</p>
            <ul className="review-list">
              {selectedQuiz.questions.map((q) => {
                const correctIds = q.answers.filter((a) => a.is_correct).map((a) => a.id);
                const userAnswerId = selectedAnswers[q.id];
                return (
                  <li key={q.id} className="review-item">
                    <strong>{q.text}</strong>
                    <ul>
                      {q.answers.map((ans) => (
                        <li key={ans.id} className={`review-answer ${ans.id === userAnswerId ? "selected-answer" : ""} ${ans.is_correct ? "correct-answer" : ""}`}>
                          {ans.text}
                        </li>
                      ))}
                    </ul>
                  </li>
                );
              })}
            </ul>
            <button className="quiz-start-btn" onClick={resetQuiz}>Retour</button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="playquiz-wrapper full-width">
      <div className="playquiz-header">
        <FaBook className="playquiz-icon" />
        <h1>Passer un Quiz</h1>
      </div>

      <div className="modules-container">
        {modules.map((mod) => (
          <div className="playquiz-module" key={mod.id}>
            <div className="module-toggle" onClick={() => toggleModule(mod.id)}>
              <span>{mod.name}</span>
              {expandedModules[mod.id] ? <FaChevronUp /> : <FaChevronDown />}
            </div>

            {expandedModules[mod.id] && (
              <div className="quiz-section">
                {loadingModule === mod.id ? (
                  <div className="loading">Chargement...</div>
                ) : quizzesByModule[mod.id]?.length > 0 ? (
                  <ul className="quiz-list">
                    {quizzesByModule[mod.id].map((quiz) => (
                      <li key={quiz.id} className="quiz-item">
                        <div className="quiz-info">
                          <span className="quiz-title">{quiz.title}</span>
                          <span className="quiz-chapter">📘 Chapitre: {quiz.chapter_name || "-"}</span>
                          <span className="quiz-author">👤 Créé par: {quiz.created_by_username || "-"}</span>
                          {recentQuizId === quiz.id && <span className="quiz-recent">🆕 Vous venez de générer ce quiz !</span>}
                        </div>
                        <button className="start-btn" onClick={() => startQuiz(quiz.id)}>
                          <FaPlay /> Commencer
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="no-quiz">Aucun quiz pour ce module</div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlayQuiz;
