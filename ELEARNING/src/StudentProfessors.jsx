import React, { useEffect, useState } from "react";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { useNavigate } from "react-router-dom";
import "./StudentProfessors.css"; // Crée ce fichier pour le style


const mockProfessors = [
  {
    id: 1,
    name: "Mme Dupont",
    speciality: "Réseaux",
    courses: [
      { title: "Réseaux avancés", type: "PDF", link: "https://example.com/pdf1" },
      { title: "Sécurité réseau", type: "Vidéo", link: "https://youtube.com/video1" },
    ],
  },
  {
    id: 2,
    name: "Mr Ahmed",
    speciality: "IA",
    courses: [
      { title: "Machine Learning", type: "PDF", link: "https://example.com/pdf2" },
      { title: "Réseaux de neurones", type: "Vidéo", link: "https://youtube.com/video2" },
    ],
  },
];

const StudentProfessors = () => {
  const [professors, setProfessors] = useState([]);

  useEffect(() => {
    // Ici on simule des données, tu peux remplacer ça par un appel à une API plus tard
    setProfessors(mockProfessors);
  }, []);

  return (
    <div className="student-professors">
      <h2 className="title">👨‍🏫 Liste des professeurs</h2>
      <div className="professors-grid">
        {professors.map((prof) => (
          <Card key={prof.id} className="prof-card" title={prof.name} subTitle={`Spécialité : ${prof.speciality}`}>
            <div>
              <h4>Cours disponibles :</h4>
              <ul>
                {prof.courses.map((course, idx) => (
                  <li key={idx}>
                    {course.title} ({course.type}) -{" "}
                    <a href={course.link} target="_blank" rel="noopener noreferrer">Voir</a>
                  </li>
                ))}
              </ul>
            </div>
            <Button label="Demander l'accès" className="access-button" />
          </Card>
        ))}
      </div>
    </div>
  );
};

export default StudentProfessors;
