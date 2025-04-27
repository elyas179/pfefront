import React, { useState } from 'react';

const UploadCustomCourseForm = ({ onUpload }) => {
  const [title, setTitle] = useState('');
  const [type, setType] = useState('cours-pdf');
  const [link, setLink] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !link) {
      alert("Tous les champs sont obligatoires !");
      return;
    }

    const newCourse = {
      id: Date.now(), // ou utiliser uuid
      name: title,
      resource_type: type,
      link,
    };

    onUpload(newCourse); // <<< correction ici
    setTitle('');
    setType('cours-pdf');
    setLink('');
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow mb-6">
      <h3 className="text-lg font-semibold mb-2">Ajouter un nouveau cours</h3>
      <input
        type="text"
        placeholder="Titre du cours"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full p-2 border rounded mb-2"
        required
      />
      <select
        value={type}
        onChange={(e) => setType(e.target.value)}
        className="w-full p-2 border rounded mb-2"
      >
        <option value="cours-pdf">Cours PDF</option>
        <option value="cours-video">Cours Vidéo</option>
      </select>
      <input
        type="text"
        placeholder="Lien du contenu (YouTube, Google Drive...)"
        value={link}
        onChange={(e) => setLink(e.target.value)}
        className="w-full p-2 border rounded mb-2"
        required
      />
      <button
        type="submit"
        className="bg-blue-600 text-white text-lg font-semibold px-6 py-2 rounded shadow hover:bg-blue-700 transition"
      >
        Ajouter
      </button>
      <button
  type="submit"
  className="bg-purple-600 text-white text-lg font-bold px-6 py-3 rounded shadow-md hover:bg-purple-700 transition-all duration-300"
>
  Ajouter
</button>
    </form>
  );
};

export default UploadCustomCourseForm;
