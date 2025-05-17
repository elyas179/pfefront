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
  const [loadingResults, setLoadingResults] = useState(false);
  const [results, setResults] = useState([]);
  const [showCorrectAnswers, setShowCorrectAnswers] = useState(false);

  useEffect(() => {
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
        setResults([]);
        setShowCorrectAnswers(false);
      });
  };

  const currentQuestion = selectedQuiz?.questions?.[currentIndex];

  const submitAnswer = async () => {
    const newSelected = { ...selectedAnswers, [currentQuestion.id]: selectedAnswers[currentQuestion.id] };
    setSelectedAnswers(newSelected);

    if (currentIndex + 1 < selectedQuiz.questions.length) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setLoadingResults(true);
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

        const calculatedResults = selectedQuiz.questions.map((question) => {
          const userAnswerId = selectedAnswers[question.id];
          const correctAnswer = question.answers.find((a) => a.is_correct);
          const isCorrect = userAnswerId === correctAnswer.id;
          return {
            question: question.text,
            userAnswer: question.answers.find((a) => a.id === userAnswerId)?.text || "Aucune réponse",
            correctAnswer: correctAnswer.text,
            isCorrect,
          };
        });

        const totalCorrect = calculatedResults.filter(r => r.isCorrect).length;
        setScore(totalCorrect);
        setResults(calculatedResults);
        setShowResults(true);
      } catch (err) {
        console.error("Erreur de soumission:", err.response?.data || err.message);
      }
      setLoadingResults(false);
    }
  };

  const resetQuiz = () => {
    setSelectedQuiz(null);
    setCurrentIndex(0);
    setSelectedAnswers({});
    setScore(0);
    setShowResults(false);
    setResults([]);
    setLoadingResults(false);
    setShowCorrectAnswers(false);
  };

  if (selectedQuiz) {
    return (
      <div className="quiz-play-page full-quiz-mode">
        <h1 className="quiz-title">🎯 {selectedQuiz.title}</h1>

        {loadingResults && <p className="loading-results">⏳ Calcul du score...</p>}

        {currentQuestion && !showResults && !loadingResults && (
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

        {showResults && !loadingResults && (
          <div className="quiz-results">
            <FaCheckCircle className="result-icon" />
            <h2>✅ Quiz terminé !</h2>
            <p>Score : {score} / {selectedQuiz.questions.length}</p>
            <button className="toggle-correct-btn" onClick={() => setShowCorrectAnswers(!showCorrectAnswers)}>
              {showCorrectAnswers ? "Cacher les bonnes réponses" : "Afficher les bonnes réponses"}
            </button>
            <ul className="detailed-results">
              {results.map((res, idx) => (
                <li key={idx} className={`result-item ${res.isCorrect ? "correct" : "incorrect"}`}>
                  <p><strong>Q{idx + 1}:</strong> {res.question}</p>
                  <p><strong>Ta réponse:</strong> {res.userAnswer}</p>
                  {showCorrectAnswers && <p><strong>Bonne réponse:</strong> {res.correctAnswer}</p>}
                  <p>{res.isCorrect ? "✅ Correct" : "❌ Incorrect"}</p>
                  <hr />
                </li>
              ))}
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
