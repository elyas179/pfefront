import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card } from "primereact/card";
import { Chart } from "primereact/chart";
import { ProgressSpinner } from "primereact/progressspinner";
import "./StudentPerformance.css";

const StudentPerformance = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const res = await axios.get("http://127.0.0.1:8000/api/ai/performance/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStats(res.data);
    } catch (err) {
      console.error("Erreur chargement des statistiques:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="performance-loading">
        <ProgressSpinner />
      </div>
    );
  }

  if (!stats) return <p className="error">Statistiques non disponibles.</p>;

  const chartData = {
    labels: ["Forts", "Faibles", "Irréguliers"],
    datasets: [
      {
        label: "Modules",
        backgroundColor: ["#22c55e", "#ef4444", "#f59e0b"],
        data: [
          stats.strong_modules?.length || 0,
          stats.weak_modules?.length || 0,
          stats.inconsistent_modules?.length || 0,
        ],
      },
    ],
  };

  const lineChart = {
    labels: stats.recent_scores?.map((s) => s.quiz) || [],
    datasets: [
      {
        label: "Scores récents",
        data: stats.recent_scores?.map((s) => s.score) || [],
        fill: false,
        borderColor: "#3b82f6",
        tension: 0.4,
      },
    ],
  };

  return (
    <div className="student-performance-container">
      <h1 className="title">📈 Suivi de Performance</h1>

      <div className="stats-grid">
        <Card title="Nombre de Quizz" className="stat-card">
          <p className="value">{stats.total_quizzes}</p>
        </Card>
        <Card title="Moyenne Générale" className="stat-card">
          <p className="value">{stats.average_score}%</p>
        </Card>
      </div>

      <div className="chart-section">
        <Card title="Modules par Catégorie" className="chart-card">
          <Chart type="doughnut" data={chartData} options={{ responsive: true, maintainAspectRatio: false }} />
        </Card>

        <Card title="Évolution des Scores" className="chart-card">
          <Chart type="line" data={lineChart} options={{ responsive: true, maintainAspectRatio: false }} />
        </Card>
      </div>

      <Card title="💡 Feedback de l'IA" className="feedback-card">
        <p>{stats.ai_feedback}</p>
      </Card>
    </div>
  );
};

export default StudentPerformance;
