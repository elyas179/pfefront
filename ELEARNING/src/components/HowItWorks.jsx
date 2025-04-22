import { motion } from "framer-motion";
import React from "react";
import "./HowItWorks.css";

const steps = [
  {
    title: "1. Crée ton compte",
    description: "Inscris-toi gratuitement en quelques clics.",
    icon: "👤"
  },
  {
    title: "2. Choisis ta spécialité",
    description: "Lance-toi dans un parcours adapté à ton niveau.",
    icon: "📚"
  },
  {
    title: "3. Apprends avec l’IA",
    description: "L’IA Curio te guide avec des contenus adaptés et des quiz intelligents.",
    icon: "🤖"
  }
];

const HowItWorks = () => {
  return (
    <section className="how-it-works-section">
      <h2 className="section-title">Comment ça fonctionne ?</h2>
      <div className="steps-container">
        {steps.map((step, index) => (
          <motion.div
            className="step-card"
            key={index}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.2 }}
            viewport={{ once: true }}
          >
            <div className="step-icon">{step.icon}</div>
            <h3>{step.title}</h3>
            <p>{step.description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default HowItWorks;
