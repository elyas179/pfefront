import React from "react";
import "./PartnersSection.css";

const logos = [
  "/assets/logo-react.png",
  "/assets/logo-django.png",
  "/assets/logo-openai.png",
  "/assets/logo-univ.png",
  "/assets/logo-postgres.png",
];

const PartnersSection = () => {
  return (
    <section className="partners-section">
      <h2 className="partners-title">Nos partenaires & technologies</h2>
      <div className="logos-container">
        <div className="logos-slider">
          {logos.concat(logos).map((src, index) => (
            <img key={index} src={src} alt="logo" className="partner-logo" />
          ))}
        </div>
      </div>
    </section>
  );
};

export default PartnersSection;
