// File: TeacherFAQ.jsx
import React from "react";
import './TeacherFAQ.css';

const faqs = [
  { id: 1, question: "Comment ajouter un cours ?", answer: "Allez dans la section 'Ajouter un cours' et remplissez le formulaire." },
  { id: 2, question: "Puis-je modifier un quiz après l'avoir créé ?", answer: "Oui, vous pouvez modifier vos quizzes depuis votre espace professeur." },
];

const TeacherFAQ = () => {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">FAQ Professeur</h1>
      <div className="space-y-4">
        {faqs.map((faq) => (
          <div key={faq.id} className="p-4 border rounded shadow-md">
            <h2 className="text-lg font-semibold">{faq.question}</h2>
            <p className="mt-2">{faq.answer}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeacherFAQ;
