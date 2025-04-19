import React from "react";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import "./Courses.css";

const FilterModal = ({ onClose }) => {
  const users = ["Étudiant", "Professeur"];
  const niveaux = ["L1", "L2", "L3"];
  const specialites = ["Informatique", "Mathématiques", "Physique"];
  const modules = ["Algorithmes", "Structures de données", "Réseaux"];

  return (
    <div className="filter-overlay">
      <div className="filter-form">
        <h2>Filtrer les cours</h2>

        <div className="form-field">
          <label>Utilisateur</label>
          <Dropdown options={users.map((u) => ({ label: u, value: u }))} placeholder="Choisir..." className="w-full" />
        </div>

        <div className="form-field">
          <label>Niveau</label>
          <Dropdown options={niveaux.map((n) => ({ label: n, value: n }))} placeholder="Choisir..." className="w-full" />
        </div>

        <div className="form-field">
          <label>Spécialité</label>
          <Dropdown options={specialites.map((s) => ({ label: s, value: s }))} placeholder="Choisir..." className="w-full" />
        </div>

        <div className="form-field">
          <label>Module</label>
          <Dropdown options={modules.map((m) => ({ label: m, value: m }))} placeholder="Choisir..." className="w-full" />
        </div>

        <div className="filter-actions">
          <Button label="Appliquer" className="p-button-success w-full" onClick={onClose} />
          <Button label="Annuler" className="p-button-text w-full mt-2" onClick={onClose} />
        </div>
      </div>
    </div>
  );
};

export default FilterModal;
