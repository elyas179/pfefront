// File: CreateQuiz.jsx
import React, { useState } from "react";
import './CreateQuiz.css';

const CreateQuiz = () => {
  const [title, setTitle] = useState("");
  const [question, setQuestion] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Quiz créé : ${title} - Question: ${question}`);
    setTitle("");
    setQuestion("");
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Créer un Quiz</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Titre du Quiz"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
        <textarea
          placeholder="Écrire une question"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
        <button
          type="submit"
          className="bg-green-600 text-white px-6 py-2 rounded"
        >
          Enregistrer
        </button>
      </form>
    </div>
  );
};

export default CreateQuiz;
