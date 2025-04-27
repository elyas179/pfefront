import React from "react";
import "./ProfsSection.css";

const profs = [
  {
    name: "M. Bouzid Karim",
    role: "Professeur en Systèmes",
    image: "https://i.pravatar.cc/150?img=11"
  },
  {
    name: "Mme. ounagi Asma",
    role: "Enseignante en IA",
    image: "https://i.pravatar.cc/150?img=32"
  },
  {
    name: "Mme.goumiri sarah",
    role: "Chercheur en Base de données",
    image: "https://i.pravatar.cc/150?img=49"
  }
];

const ProfsSection = () => {
  return (
    <section className="profs-section">
      <h2 className="profs-title">Nos Professeurs</h2>
      <div className="profs-grid">
        {profs.map((prof, index) => (
          <div key={index} className="prof-card">
            <img src={prof.image} alt={prof.name} className="prof-photo" />
            <h3>{prof.name}</h3>
            <p>{prof.role}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ProfsSection;
