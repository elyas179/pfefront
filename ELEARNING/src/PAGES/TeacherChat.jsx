// File: TeacherChat.jsx
import React, { useState } from "react";
import './TeacherChat.css';

const TeacherChat = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([
    { id: 1, from: "Sara", content: "Bonjour professeur !" },
  ]);

  const handleSend = (e) => {
    e.preventDefault();
    if (message.trim() === "") return;
    setMessages([...messages, { id: Date.now(), from: "Vous", content: message }]);
    setMessage("");
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Chat avec les Étudiants</h1>
      <div className="border p-4 h-64 overflow-y-auto mb-4">
        {messages.map((msg) => (
          <div key={msg.id} className="mb-2">
            <strong>{msg.from}:</strong> {msg.content}
          </div>
        ))}
      </div>
      <form onSubmit={handleSend} className="flex space-x-2">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="flex-1 p-2 border rounded"
          placeholder="Écrire un message..."
        />
        <button type="submit" className="bg-blue-500 text-white px-4 rounded">
          Envoyer
        </button>
      </form>
    </div>
  );
};

export default TeacherChat;
