// src/pages/StudentPerformance.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card } from "primereact/card";
import { ProgressBar } from "primereact/progressbar";
import { motion } from "framer-motion";
import "./StudentPerformance.css";

const StudentPerformance = () => {
  const [performanceData, setPerformanceData] = useState(null);

  useEffect(() => {
    const fetchPerformance = async () => {
      const token = localStorage.getItem("accessToken");
      try {
        const res = await axios.get("http://127.0.0.1:8000/api/ai/performance-tracking/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPerformanceData(res.data);
      } catch (err) {
        console.error("Erreur chargement performance:", err);
      }
    };

    fetchPerformance();
  }, []);

  return (
    <motion.div
      className="performance-container"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <h1>📊 Tes Performances</h1>
      {performanceData ? (
        <Card className="performance-card">
          <p><strong>Score global :</strong></p>
          <ProgressBar value={performanceData.global_score} />
          <p><strong>Commentaires IA :</strong></p>
          <p>{performanceData.feedback}</p>
        </Card>
      ) : (
        <p>Chargement...</p>
      )}
    </motion.div>
  );
};

export default StudentPerformance;
