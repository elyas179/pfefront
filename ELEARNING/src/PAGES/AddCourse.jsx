// File: AddCourse.jsx
import React, { useState } from "react";
import './AddCourse.css';
import { d } from '../'
const AddCourse = () => {
  const [name, setName] = useState("");
  const [type, setType] = useState("cours-pdf");
  const [link, setLink] = useState("");

  const [chapter, setChapter] = useState(2);
  const [accessType, setAccessType] = useState("public");

  const handleSubmit = (e) => {
    const courseData = {
      name,
      resource_type:type,
      link,
      chapter,
      access_type:accessType
    }

    addRessource.
    e.preventDefault();
    alert(`Cours ajouté : ${name} (${type})`);
    setName("");
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
          value={name}
          onChange={(e) => setName(e.target.value)}
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
          <option value="td-pdf">TD PDF</option>
          <option value="td-video">TD Vidéo</option>
          <option value="tp-pdf">TP PDF</option>
          <option value="tp-video">TP Vidéo</option>
        </select>
        <input
          type="text"
          placeholder="Lien du contenu"
          value={link}
          onChange={(e) => setLink(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />

        <select
          value={type}
          onChange={(e) => setAccessType(e.target.value)}
          className="w-full p-2 border rounded">
          <option value="public">Public</option>
          <option value="private">Privée</option>
        </select>

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
