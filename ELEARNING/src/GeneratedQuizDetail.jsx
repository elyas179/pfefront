// File: GeneratedQuizDetail.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./GeneratedQuizDetail.css";

const GeneratedQuizDetail = () => {
  const { id } = useParams();
  const [quiz, setQuiz] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    axios
      .get(`http://127.0.0.1:8000/api/ai/genquizzes/${id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setQuiz(res.data))
      .catch((err) => console.error("Erreur chargement quiz IA:", err));
  }, [id]);

  if (!quiz) {
    return <p>Chargement du quiz...</p>;
  }

  return (
    <div className="generated-quiz-page">
      <h1>{quiz.title}</h1>
      <p className="description">{quiz.description}</p>
      <div className="questions">
        {quiz.questions.map((q, index) => (
          <div className="question" key={index}>
            <h3>{index + 1}. {q.question}</h3>
            <ul>
              {q.choices.map((c, i) => (
                <li key={i}>{c}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GeneratedQuizDetail;
