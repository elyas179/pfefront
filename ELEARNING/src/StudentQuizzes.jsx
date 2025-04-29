// File: StudentQuizzes.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { ProgressSpinner } from "primereact/progressspinner";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom"; // ✅ Ajout
import "./StudentQuizzes.css";

const StudentQuizzes = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // ✅ Ajout

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    axios
      .get("http://127.0.0.1:8000/api/quizzes/", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setQuizzes(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Erreur chargement quizzes:", err);
        setLoading(false);
      });
  }, []);

  const handleStartQuiz = (quizId) => {
    navigate(`/quiz/${quizId}`); // ✅ Navigation vers la page du quiz
  };

  if (loading) {
    return (
      <div className="quiz-loading">
        <ProgressSpinner />
      </div>
    );
  }

  return (
    <div className="quiz-container">
      <h1 className="quiz-title">📝 Quizzes Disponibles</h1>

      {quizzes.length > 0 ? (
        <div className="quiz-grid">
          {quizzes.map((quiz) => (
            <motion.div
              key={quiz.id}
              className="quiz-card"
              whileHover={{ scale: 1.05 }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <h3 className="quiz-name">{quiz.title}</h3>
              <p className="quiz-description">{quiz.description}</p>
              <Button 
                label="Commencer" 
                className="quiz-button" 
                icon="pi pi-play"
                onClick={() => handleStartQuiz(quiz.id)} // ✅ onClick pour démarrer
              />
            </motion.div>
          ))}
        </div>
      ) : (
        <p className="no-quizzes">Aucun quiz n'est disponible pour le moment.</p>
      )}
    </div>
  );
};

export default StudentQuizzes;
