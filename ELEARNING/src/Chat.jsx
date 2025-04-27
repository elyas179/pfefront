import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
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

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const token = localStorage.getItem("accessToken");
    const userMessage = { user_message: input };
    setMessages((prev) => [...prev, { sender: "user", text: input }]);
    setInput("");
    setLoading(true);

    try {
      const res = await axios.post("http://127.0.0.1:8000/api/ai/chatbot/", userMessage, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const botReply = res.data.bot_response;
      setMessages((prev) => [...prev, { sender: "bot", text: botReply }]);
    } catch (err) {
      console.error("Erreur chatbot:", err);
      setMessages((prev) => [...prev, { sender: "bot", text: "❌ Erreur de connexion." }]);
    } finally {
      setLoading(false); // 🔥 Réactive le champ même après une erreur
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
      <h2 className="chat-title">🤖 Assistant Intelligent</h2>

      <div className="chat-box">
        {messages.map((msg, index) => (
          <motion.div
            key={index}
            className={`chat-message ${msg.sender}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card className="message-card">
              <span>{msg.text}</span>
            </Card>
          </motion.div>
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
