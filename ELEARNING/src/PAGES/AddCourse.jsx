// File: AddCourse.jsx
import React, { useState } from "react";
import './AddCourse.css';

const AddCourse = () => {
  const [title, setTitle] = useState("");
  const [type, setType] = useState("cours-pdf");
  const [link, setLink] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Cours ajouté : ${title} (${type})`);
    setTitle("");
    setType("cours-pdf");
    setLink("");
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Ajouter un Cours</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Titre du cours"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="w-full p-2 border rounded"
        >
          <option value="cours-pdf">Cours PDF</option>
          <option value="cours-video">Cours Vidéo</option>
          <option value="cours-presentation">Présentation</option>
          <option value="cours-audio">Audio</option>
        </select>
        <input
          type="text"
          placeholder="Lien du contenu"
          value={link}
          onChange={(e) => setLink(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
        <button
          type="submit"
          className="bg-green-600 text-white px-6 py-2 rounded"
        >
          Enregistrer
        </button>
      </form>
    </div>
  );
};

export default AddCourse;
