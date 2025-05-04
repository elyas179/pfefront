import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getChaptersByModule } from '../services/chaptersService';

const ChaptersPage = () => {
  const { id } = useParams();
  const [chapters, setChapters] = useState([]);

  useEffect(() => {
    getChaptersByModule(id).then(setChapters);
  }, [id]);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">🧩 Chapitres du module</h1>
      {chapters.map(chap => (
        <div key={chap.id} className="border p-4 rounded shadow mb-2">
          <h2>{chap.name}</h2>
          <Link to={`/chapters/${chap.id}/resources`} className="text-blue-600 underline">Voir les ressources</Link>
        </div>
      ))}
    </div>
  );
};

export default ChaptersPage;
