import React from "react";
import "./TestimonialsSection.css";

const testimonials = [
  {
    name: "elyes gm.",
    level: "L2 ISIL",
    comment: "Grâce à Curio, j’ai enfin compris la logique de programmation !",
    photo: "https://i.pravatar.cc/100?img=1"
  },
  {
    name: "rania K.",
    level: "L3 ACAD",
    comment: "Les quiz et les modules IA m'ont vraiment aidé à progresser rapidement.",
    photo: "https://i.pravatar.cc/100?img=5"
  },
  {
    name: "Yasmine D.",
    level: "L1",
    comment: "Une plateforme moderne et claire, j'adore le suivi personnalisé !",
    photo: "https://i.pravatar.cc/100?img=9"
  }
];

const TestimonialsSection = () => {
  return (
    <section className="testimonials-section">
      <h2 className="testimonials-title">Ce que disent nos étudiants</h2>
      <div className="testimonials-grid">
        {testimonials.map((t, index) => (
          <div className="testimonial-card" key={index}>
            <img src={t.photo} alt={t.name} className="testimonial-photo" />
            <p className="testimonial-comment">“{t.comment}”</p>
            <p className="testimonial-name">{t.name} – <span>{t.level}</span></p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TestimonialsSection;
