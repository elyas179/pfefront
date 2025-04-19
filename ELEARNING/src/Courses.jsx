import React, { useState } from "react";
import { Carousel } from "primereact/carousel";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "./Courses.css";
import FilterModal from "./FilterModal";

const dummyCourses = [
  {
    title: "Intelligence Artificielle",
    image: "/ai.jpg",
    description: "Explorez les concepts fondamentaux de l'IA.",
  },
  {
    title: "Développement Web",
    image: "/web.jpg",
    description: "Apprenez à créer des sites modernes et responsives.",
  },
  {
    title: "Analyse de Données",
    image: "/data.jpg",
    description: "Manipulez et analysez de grandes quantités de données.",
  },
];

const Courses = () => {
  const [showFilters, setShowFilters] = useState(false);

  const courseTemplate = (course) => {
    return (
      <Card className="course-card" header={<img src={course.image} alt={course.title} className="course-img" />}>
        <h3>{course.title}</h3>
        <p>{course.description}</p>
      </Card>
    );
  };

  return (
    <div className={`courses-page ${showFilters ? "blurred-background" : ""}`}>
      <h1 className="courses-title">Explorez Nos Cours</h1>

      <Button
        label="Afficher les Filtres"
        icon="pi pi-filter"
        className="filter-button"
        onClick={() => setShowFilters(true)}
      />

      <Carousel
        value={dummyCourses}
        itemTemplate={courseTemplate}
        numVisible={3}
        numScroll={1}
        className="course-carousel"
      />

      {showFilters && <FilterModal onClose={() => setShowFilters(false)} />}
    </div>
  );
};

export default Courses;
