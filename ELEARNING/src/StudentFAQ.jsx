import React, { useState } from "react";
import { Accordion, AccordionTab } from "primereact/accordion";
import { motion } from "framer-motion";
import "./StudentFAQ.css";

const faqData = [
  {
    question: "Comment m'inscrire à un cours ?",
    answer: "Allez dans la section 'mes Cours', sélectionnez le cours souhaité et cliquez sur 'S'inscrire'."
  },
  {
    question: "Puis-je changer mon niveau ou ma spécialité ?",
    answer: "Oui, dans la section Paramètres → Modifier mes infos."
  },
  {
    question: "Comment participer à un quiz ?",
    answer: "Rendez-vous dans la section 'Quizzes' pour voir les quiz disponibles."
  },
  {
    question: "Comment fonctionne le système de performance IA ?",
    answer: "L'IA analyse vos résultats pour vous proposer du contenu personnalisé."
  },
  {
    question: "Puis-je discuter avec mes professeurs ?",
    answer: "Oui, utilisez le Chat Bot ou la section Communauté pour poser vos questions."
  },
  {
    question: "Comment récupérer mon mot de passe ?",
    answer: "Cliquez sur 'Mot de passe oublié' depuis la page de connexion."
  }
];

const StudentFAQ = () => {
  return (
    <motion.div
      className="faq-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="faq-title">❓ Foire aux questions</h1>
      <Accordion className="faq-accordion" multiple activeIndex={[0]}>
        {faqData.map((item, idx) => (
          <AccordionTab header={item.question} key={idx} className="faq-tab">
            <p>{item.answer}</p>
          </AccordionTab>
        ))}
      </Accordion>
    </motion.div>
  );
};

export default StudentFAQ;