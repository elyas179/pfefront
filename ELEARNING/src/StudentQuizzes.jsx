import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import "./StudentQuizzes.css";

const StudentQuizzes = () => {
  const navigate = useNavigate();

  return (
    <div className="student-quizzes-wrapper">
      <h1 className="quiz-title">🧠 Plateforme des Quiz</h1>
      <div className="quiz-card-container">
        <Card className="quiz-card" title="📘 Passer un Quiz">
          <p className="quiz-description">
            Choisissez parmi les quiz disponibles pour tester vos connaissances.
          </p>
          <Button
            label="Commencer un Quiz"
            icon="pi pi-play"
            className="quiz-action-btn"
            onClick={() => navigate("/quizzes/play")}
          />
        </Card>

        <Card className="quiz-card" title="✨ Générer un Quiz">
          <p className="quiz-description">
            Créez un quiz personnalisé basé sur un module et des chapitres spécifiques.
          </p>
          <Button
            label="Générer un Quiz"
            icon="pi pi-cog"
            className="quiz-action-btn"
            onClick={() => navigate("/quizzes/gen")}
          />
        </Card>
      </div>
    </div>
  );
};

export default StudentQuizzes;
