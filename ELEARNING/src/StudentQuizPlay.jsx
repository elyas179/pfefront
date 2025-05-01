import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { ProgressSpinner } from "primereact/progressspinner";
import { motion } from "framer-motion";
import "./StudentQuizPlay.css";

const StudentQuizPlay = () => {
  const { id } = useParams(); // ID du quiz
  const navigate = useNavigate();

  const [quiz, setQuiz] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const res = await axios.get(`http://127.0.0.1:8000/api/quizzes/${id}/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setQuiz(res.data);
        setQuestions(res.data.questions || []);
        setLoading(false);
      } catch (err) {
        console.error("Erreur chargement quiz:", err);
        setLoading(false);
      }
    };
    fetchQuiz();
  }, [id]);

  const handleAnswer = (questionId, answerId) => {
    setSelectedAnswers((prev) => {
      const updated = [...prev.filter((a) => a.questionId !== questionId), { questionId, answerId }];
      return updated;
    });
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleSubmit = async () => {
    const token = localStorage.getItem("accessToken");
    setSubmitting(true);

    try {
        const user = JSON.parse(localStorage.getItem("user"));
      const payload = {
        quiz: id,
        student:user.id,
        selected_answers: selectedAnswers.map(a => a.answerId),
      };

      await axios.post(`http://127.0.0.1:8000/api/quizzes/submissions/`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("✅ Quiz soumis avec succès !");
      navigate("/quizes");
    } catch (err) {
      console.error("Erreur soumission quiz:", err);
      alert("❌ Erreur soumission quiz.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="quiz-loading">
        <ProgressSpinner />
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];

  return (
    <motion.div
      className="quiz-play-container"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="quiz-title">{quiz?.title}</h1>

      {currentQuestion ? (
        <Card className="quiz-question-card">
          <h2 className="question-text">{currentQuestion.text}</h2>

          <div className="answers-list">
            {currentQuestion.answers.map((ans) => (
              <motion.button
                key={ans.id}
                onClick={() => handleAnswer(currentQuestion.id, ans.id)}
                whileHover={{ scale: 1.05 }}
                className={`answer-button ${
                  selectedAnswers.find((a) => a.questionId === currentQuestion.id && a.answerId === ans.id) ? "selected" : ""
                }`}
              >
                {ans.text}
              </motion.button>
            ))}
          </div>

          <div className="quiz-navigation">
            <Button
              label="⬅️ Précédent"
              onClick={handlePrevious}
              className="prev-button"
              disabled={currentIndex === 0}
            />
            {currentIndex < questions.length - 1 ? (
              <Button
                label="Suivant ➡️"
                onClick={handleNext}
                className="next-button"
              />
            ) : (
              <Button
                label={submitting ? "Envoi..." : "Terminer le quiz"}
                onClick={handleSubmit}
                className="submit-button"
                disabled={submitting}
              />
            )}
          </div>
        </Card>
      ) : (
        <p>Aucune question disponible pour ce quiz.</p>
      )}
    </motion.div>
  );
};

export default StudentQuizPlay;
