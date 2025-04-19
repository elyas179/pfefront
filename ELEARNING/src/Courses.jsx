// File: Courses.jsx
import React, { useState } from "react";
import { Carousel } from "primereact/carousel";
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "./Courses.css";
import Footer from "./Footer";

const modulesData = {
  L1: {
    S1: [
      { name: "Algorithmique", icon: "pi pi-code" },
      { name: "Analyses", icon: "pi pi-chart-line" },
      { name: "Algèbre", icon: "pi pi-sliders-h" },
      { name: "MP", icon: "pi pi-compass" },
      { name: "Structure machine", icon: "pi pi-cog" },
    ],
    S2: [
      { name: "Algorithmique", icon: "pi pi-code" },
      { name: "Analyses", icon: "pi pi-chart-line" },
      { name: "Statistique", icon: "pi pi-chart-bar" },
      { name: "Algèbre", icon: "pi pi-sliders-h" },
      { name: "MP", icon: "pi pi-compass" },
      { name: "OPM", icon: "pi pi-database" },
      { name: "Structure machine", icon: "pi pi-cog" },
    ],
  },
  L2: {
    ACAD: {
      S3: [
        { name: "Algorithmique", icon: "pi pi-code" },
        { name: "Architecture d’ordinateur", icon: "pi pi-desktop" },
        { name: "Système d’information", icon: "pi pi-server" },
        { name: "Math info", icon: "pi pi-calculator" },
        { name: "Proba Stat", icon: "pi pi-percentage" },
        { name: "Logique mathématique", icon: "pi pi-check-circle" },
      ],
      S4: [
        { name: "Système exploitation", icon: "pi pi-cog" },
        { name: "Architecture 2", icon: "pi pi-desktop" },
        { name: "Théorie des langages", icon: "pi pi-globe" },
        { name: "Base de données", icon: "pi pi-database" },
        { name: "POO", icon: "pi pi-code" },
        { name: "Anglais", icon: "pi pi-comment" },
      ],
    },
    ISIL: {
      S3: [
        { name: "Algorithmique", icon: "pi pi-code" },
        { name: "Architecture", icon: "pi pi-desktop" },
        { name: "Analyse numérique", icon: "pi pi-percentage" },
        { name: "Logique", icon: "pi pi-check-circle" },
        { name: "SI", icon: "pi pi-server" },
      ],
      S4: [
        { name: "Programmation web", icon: "pi pi-globe" },
        { name: "Génie logiciel", icon: "pi pi-sliders-h" },
        { name: "THG", icon: "pi pi-code" },
        { name: "Architecture", icon: "pi pi-desktop" },
        { name: "Système exploitation", icon: "pi pi-cog" },
        { name: "Base de données", icon: "pi pi-database" },
      ],
    },
  },
  L3: {
    ACAD: {
      S5: [
        { name: "Théorie des graphes", icon: "pi pi-share-alt" },
        { name: "Génie logiciel", icon: "pi pi-sliders-h" },
        { name: "Compile", icon: "pi pi-code" },
        { name: "Système exploitation", icon: "pi pi-cog" },
        { name: "Réseau", icon: "pi pi-wifi" },
      ],
      S6: [
        { name: "Document structuré", icon: "pi pi-file" },
        { name: "Programmation web", icon: "pi pi-globe" },
        { name: "IA", icon: "pi pi-robot" },
        { name: "Admin serveur", icon: "pi pi-server" },
        { name: "Anglais", icon: "pi pi-comment" },
      ],
    },
    ISIL: {
      S5: [
        { name: "Réseau", icon: "pi pi-wifi" },
        { name: "Système exploitation", icon: "pi pi-cog" },
        { name: "GL2", icon: "pi pi-sliders-h" },
        { name: "Base de données", icon: "pi pi-database" },
        { name: "Compile", icon: "pi pi-code" },
      ],
      S6: [
        { name: "Génie logiciel", icon: "pi pi-sliders-h" },
        { name: "Réseau", icon: "pi pi-wifi" },
        { name: "IA", icon: "pi pi-robot" },
        { name: "Anglais", icon: "pi pi-comment" },
      ],
    },
  },
};

const Courses = () => {
  const [query, setQuery] = useState("");
  const [selectedYear, setSelectedYear] = useState("L1");
  const [speciality, setSpeciality] = useState("ACAD");

  const filterModules = (list) => {
    return list.filter((m) => m.name.toLowerCase().includes(query.toLowerCase()));
  };

  const cardTemplate = (mod) => (
    <Card className="module-card">
      <div className="icon-container">
        <i className={`${mod.icon} module-icon`}></i>
      </div>
      <p>{mod.name}</p>
    </Card>
  );

  return (
    <div className="page-container">
    <div className="courses-wrapper">
      <h1 className="main-title">📚 Modules par Niveau</h1>

      <div className="search-bar center">
        <InputText
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="🔍 Rechercher un module..."
        />
      </div>

      <div className="dropdown-selectors">
        <Dropdown
          value={selectedYear}
          options={[{ label: "L1", value: "L1" }, { label: "L2", value: "L2" }, { label: "L3", value: "L3" }]}
          onChange={(e) => setSelectedYear(e.value)}
          placeholder="Niveau"
          className="year-dropdown"
        />
        {(selectedYear === "L2" || selectedYear === "L3") && (
          <Dropdown
            value={speciality}
            options={[{ label: "ACAD", value: "ACAD" }, { label: "ISIL", value: "ISIL" }]}
            onChange={(e) => setSpeciality(e.value)}
            placeholder="Spécialité"
            className="spec-dropdown"
          />
        )}
      </div>

      {selectedYear === "L1" &&
        Object.entries(modulesData[selectedYear]).map(([sem, mods]) => (
          <div key={sem} className="semester-section">
            <h3 className="semester-title">{sem}</h3>
            <Carousel
              value={filterModules(mods)}
              itemTemplate={cardTemplate}
              numVisible={3}
              circular
              autoplayInterval={5000}
              showIndicators={false}
              showNavigators={true}
            />
          </div>
        ))}

      {(selectedYear === "L2" || selectedYear === "L3") &&
        Object.entries(modulesData[selectedYear][speciality]).map(([sem, mods]) => (
          <div key={sem} className="semester-section">
            <h3 className="semester-title">{sem}</h3>
            <Carousel
              value={filterModules(mods)}
              itemTemplate={cardTemplate}
              numVisible={3}
              circular
              autoplayInterval={5000}
              showIndicators={false}
              showNavigators={true}
            />
          </div>
        ))}
    </div>
  
    </div>
  );
};

export default Courses;
