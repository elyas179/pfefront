// File: TeacherSettings.jsx
import React, { useState } from "react";
import './TeacherSettings.css';

const TeacherSettings = () => {
  const [email, setEmail] = useState("prof@example.com");
  const [password, setPassword] = useState("");

  const handleSave = () => {
    alert("Paramètres enregistrés !");
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Paramètres du Professeur</h1>
      <div className="space-y-4">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 border rounded"
          placeholder="Email"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 border rounded"
          placeholder="Nouveau mot de passe"
        />
        <button
          onClick={handleSave}
          className="bg-blue-600 text-white px-6 py-2 rounded"
        >
          Sauvegarder
        </button>
      </div>
    </div>
  );
};

export default TeacherSettings;
