import React, { useState } from "react";
import "./FaqSection.css";

const faqs = [
  {
    question: "Est-ce que Curio est gratuit ?",
    answer: "Oui, l'inscription et l'accès aux modules de base sont entièrement gratuits."
  },
  {
    question: "Comment fonctionne l’IA de Curio ?",
    answer: "L'IA analyse vos progrès pour vous proposer des contenus adaptés à votre niveau."
  },
  {
    question: "Puis-je suivre plusieurs spécialités ?",
    answer: "Oui, vous pouvez explorer d'autres spécialités en plus de votre parcours principal."
  },
];

const FaqSection = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="faq-section">
      <h2 className="faq-title">Questions Fréquentes</h2>
      <div className="faq-list">
        {faqs.map((faq, index) => (
          <div key={index} className={`faq-item ${openIndex === index ? "open" : ""}`}>
            <div className="faq-question" onClick={() => toggle(index)}>
              {faq.question}
            </div>
            {openIndex === index && <div className="faq-answer">{faq.answer}</div>}
          </div>
        ))}
      </div>
    </section>
  );
};

export default FaqSection;
