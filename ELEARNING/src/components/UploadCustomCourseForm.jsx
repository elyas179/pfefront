/*import React, { useState } from 'react';

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

export default UploadCustomCourseForm;*/

import React, { useState } from 'react';

const UploadCustomCourseForm = ({ onUpload }) => {
  const [title, setTitle] = useState('');
  const [type, setType] = useState('cours-pdf');  // Valeur par défaut
  const [link, setLink] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Liste des types de cours définis dans ton modèle Django
  const resourceTypes = [
    { value: 'cours-pdf', label: 'Cours PDF' },
    { value: 'cours-video', label: 'Cours Vidéo' },
    { value: 'td-pdf', label: 'TD PDF' },
    { value: 'td-video', label: 'TD Vidéo' },
    { value: 'tp-pdf', label: 'TP PDF' },
    { value: 'tp-video', label: 'TP Vidéo' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !link) {
      alert("Tous les champs sont obligatoires !");
      return;
    }

    // Création du nouvel objet cours
    const newCourse = {
      name: title,
      resource_type: type,
      link: link,
    };

    // Envoi de la requête POST à l'API Django
    setLoading(true);
    try {
      const response = await fetch('/api/resources/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`, // Si tu utilises un token d'authentification
        },
        body: JSON.stringify(newCourse),
      });

      if (response.ok) {
        const data = await response.json();
        onUpload(data);  // Appel la fonction onUpload pour mettre à jour l'état du parent
        setTitle('');
        setType('cours-pdf');
        setLink('');
        alert('Cours ajouté avec succès !');
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Erreur lors de l\'ajout du cours.');
      }
    } catch (err) {
      setError('Une erreur est survenue lors de la soumission.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow mb-6">
      <h3 className="text-lg font-semibold mb-2">Ajouter un nouveau cours</h3>
      {error && <p className="text-red-500 mb-4">{error}</p>}
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
        {resourceTypes.map((resource) => (
          <option key={resource.value} value={resource.value}>
            {resource.label}
          </option>
        ))}
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
        disabled={loading}
      >
        {loading ? 'Ajout en cours...' : 'Ajouter'}
      </button>
    </form>
  );
};

export default UploadCustomCourseForm;

