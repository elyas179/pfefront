import React from 'react';
import './ProfessorsList.css';

const mockProfessors = [
  {
    id: 1,
    name: 'Mme Bouchra',
    courses: [
      { title: 'Algorithmes avancés', type: 'PDF', link: 'https://example.com/pdf1' },
      { title: 'POO en Java', type: 'Vidéo', link: 'https://youtube.com/...1' },
    ],
  },
  {
    id: 2,
    name: 'Mr Karim',
    courses: [
      { title: 'Systèmes embarqués', type: 'PDF', link: 'https://example.com/pdf2' },
    ],
  },
];

const ProfessorsList = () => {
  return (
    <div className="professor-page">
      <h2>Liste des Professeurs</h2>
      {mockProfessors.map((prof) => (
        <div key={prof.id} className="professor-card">
          <h3>{prof.name}</h3>
          <ul>
            {prof.courses.map((course, index) => (
              <li key={index}>
                📘 <strong>{course.title}</strong> ({course.type}) —{' '}
                <a href={course.link} target="_blank" rel="noopener noreferrer">
                  Voir
                </a>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default ProfessorsList;
