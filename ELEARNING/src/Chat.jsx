// File: src/Chat.jsx
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { motion } from "framer-motion";
import "./Chat.css";

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const res = await axios.get("http://127.0.0.1:8000/api/ai/chatbot/", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const formatted = res.data
          .map((m) => [
            { sender: "user", text: m.user_message },
            { sender: "bot", text: m.bot_response },
          ])
          .flat();

        setMessages(formatted);
      } catch (err) {
        console.error("Erreur lors du chargement:", err);
      }
    };

    fetchMessages();
  }, []);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const token = localStorage.getItem("accessToken");
    const userMessage = { user_message: input };

    setMessages((prev) => [...prev, { sender: "user", text: input }]);
    setInput("");
    setLoading(true);
// Fonction pour couper le texte automatiquement tous les 5 mots
const formatBotText = (text, wordsPerLine = 5) => {
  const words = text.split(/\s+/); // divise en mots
  const lines = [];

  for (let i = 0; i < words.length; i += wordsPerLine) {
    lines.push(words.slice(i, i + wordsPerLine).join(" "));
  }

  return lines.join("\n");
};

    try {
      const res = await axios.post(
        "http://127.0.0.1:8000/api/ai/chatbot/",
        userMessage,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: res.data.bot_response },
      ]);
    } catch (err) {
      console.error("Erreur chatbot:", err);
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "❌ Erreur serveur. Réessaie." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  return (
    <motion.div
      className="chat-container"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="chat-title">🤖 Curio Assistant</h2>

      <div className="chat-box">
        {messages.map((msg, index) => (
          <div key={index} className={`chat-message ${msg.sender}`}>
            <div className="chat-bubble">
              {msg.text.replace(/\n/g, " ")}
            </div>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      <div className="chat-input-area">
        <InputText
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Pose ta question..."
          className="chat-input"
          disabled={loading}
        />
        <Button
          label={loading ? "..." : "Envoyer"}
          onClick={sendMessage}
          className="send-button"
          disabled={loading}
        />
      </div>
    </motion.div>
  );
};

export default Chat;
