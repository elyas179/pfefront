import React, { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { InputNumber } from "primereact/inputnumber";
import { RadioButton } from "primereact/radiobutton";
import { InputTextarea } from "primereact/inputtextarea";
import { Button } from "primereact/button";
import { ProgressSpinner } from "primereact/progressspinner";
import { Card } from "primereact/card";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { motion } from "framer-motion";
import "./Program.css";

const Program = () => {
  const [studyHours, setStudyHours] = useState(5);
  const [daysUntilExam, setDaysUntilExam] = useState(10);
  const [preferredTime, setPreferredTime] = useState("Après-midi");
  const [goals, setGoals] = useState("");
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("accessToken");
  const userId = jwtDecode(token).user_id;

  useEffect(() => {
    fetchPrograms();
  }, []);

  const fetchPrograms = async () => {
    try {
      const res = await axios.get(
        `http://127.0.0.1:8000/api/ai/user/${userId}/program-recommendations/`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPrograms(res.data);
    } catch (error) {
      console.error("Erreur chargement programmes:", error);
    }
  };

  const handleSubmit = async () => {
    if (!goals) return alert("Veuillez entrer vos objectifs !");
    setLoading(true);
    try {
      await axios.post(
        "http://127.0.0.1:8000/api/ai/program-recommendations/",
        {
          study_hours_per_day: studyHours,
          days_until_exam: daysUntilExam,
          preferred_study_time: preferredTime,
          goals: goals,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchPrograms();
    } catch (err) {
      console.error("Erreur création programme:", err);
    } finally {
      setLoading(false);
    }
  };

  const parsePersonalInfo = (section) => {
    const lines = section.split("\n").filter(Boolean);
    const info = {
      objectif: "Objectif non défini",
      temps: "Inconnu",
      joursRestants: "Inconnu",
    };

    lines.forEach((line) => {
      if (line.includes("Objectif de note")) {
        info.objectif = line.split(":")[1]?.trim();
      } else if (line.includes("Temps d'étude par jour")) {
        info.temps = line.split(":")[1]?.trim();
      } else if (line.includes("Nombre de jours jusqu'aux examens")) {
        info.joursRestants = line.split(":")[1]?.trim();
      }
    });

    return info;
  };

  const parseAdvancedPlanning = (text) => {
    const days = text.split(/#### \*\*(Jour \d+.*?)\*\*/g);
    const parsed = [];
    for (let i = 1; i < days.length; i += 2) {
      const day = days[i]?.trim();
      const body = days[i + 1];
      const lines = body?.split("\n").filter(Boolean) || [];
      const activities = lines.map((line) => {
        const match = line.match(/- \*\*(.*?)\*\* ?: (.*)/);
        if (match) {
          return { time: match[1].trim(), activity: match[2].trim() };
        }
        const fallback = line.match(/- (\d{1,2}h\d{2} - \d{1,2}h\d{2}) ?: (.*)/);
        if (fallback) {
          return { time: fallback[1].trim(), activity: fallback[2].trim() };
        }
        return null;
      }).filter(Boolean);
      if (day && activities.length > 0) {
        parsed.push({ day, activities });
      }
    }
    return parsed;
  };

  const parseProgram = (text) => {
    const sections = text.split("###");
    const details = {
      advancedPlanning: [],
      modules: [],
      tips: [],
      motivation: [],
      objectif: "Objectif non défini",
      temps: "Inconnu",
      joursRestants: "Inconnu",
    };

    sections.forEach((section) => {
      if (section.includes("Planning Quotidien")) {
        details.advancedPlanning = parseAdvancedPlanning("###" + section);
      } else if (section.includes("Modules et Chapitres")) {
        details.modules = section.split("\n").slice(1).filter(Boolean);
      } else if (section.includes("Conseils d'Organisation")) {
        details.tips = section.split("\n").slice(1).filter(Boolean);
      } else if (section.includes("Motivation")) {
        details.motivation = section.split("\n").slice(1).filter(Boolean);
      } else if (section.includes("Informations Personnelles")) {
        const info = parsePersonalInfo(section);
        details.objectif = info.objectif;
        details.temps = info.temps;
        details.joursRestants = info.joursRestants;
      }
    });

    return details;
  };

  return (
    <div className="program-container">
      <h1>📘 Votre Programme d'Étude Personnalisé</h1>

      <div className="existing-programs">
        {programs.length === 0 ? (
          <p>Aucun programme trouvé.</p>
        ) : (
          programs.map((prog, index) => {
            let details = {};
            try {
              details = parseProgram(prog.recommendation_text);
            } catch (e) {
              console.error("Erreur parsing programme:", e);
              return <div key={index}>Erreur d'analyse du programme.</div>;
            }

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="program-card">
                  <h2>{details.objectif}</h2>
                  <p><strong>Temps quotidien :</strong> {details.temps}</p>
                  <p><strong>Jours restants :</strong> {details.joursRestants}</p>

                  {details.advancedPlanning.length > 0 && (
                    <>
                      <h3>🗓️ Planning Graphique par Jour</h3>
                      {details.advancedPlanning.map((dayPlan, i) => (
                        <div key={i} className="day-card">
                          <h4>{dayPlan.day}</h4>
                          <DataTable value={dayPlan.activities} responsiveLayout="scroll">
                            <Column field="time" header="Heure" />
                            <Column field="activity" header="Activité" />
                          </DataTable>
                        </div>
                      ))}
                    </>
                  )}

                  {details.modules.length > 0 && (
                    <>
                      <h3>📚 Modules et Chapitres</h3>
                      <ul>{details.modules.map((m, i) => <li key={i}>{m}</li>)}</ul>
                    </>
                  )}

                  {details.tips.length > 0 && (
                    <>
                      <h3>✅ Conseils d'Organisation</h3>
                      <ul>{details.tips.map((t, i) => <li key={i}>{t}</li>)}</ul>
                    </>
                  )}

                  {details.motivation.length > 0 && (
                    <>
                      <h3>🚀 Motivation</h3>
                      <ul>{details.motivation.map((m, i) => <li key={i}>{m}</li>)}</ul>
                    </>
                  )}
                </Card>
              </motion.div>
            );
          })
        )}
      </div>

      {programs.length > 0 && programs[0].recommendation_text && (
        <div className="planning-section">
          <h2>🧭 Planning Visuel Quotidien</h2>
          {parseAdvancedPlanning(programs[0].recommendation_text).map((dayPlan, index) => (
            <div key={index} className="day-visual-card">
              <h3>{dayPlan.day}</h3>
              <DataTable value={dayPlan.activities} responsiveLayout="scroll" className="planning-table">
                <Column field="time" header="Heure" style={{ width: '30%' }} />
                <Column field="activity" header="Activité" style={{ width: '70%' }} />
              </DataTable>
            </div>
          ))}
        </div>
      )}

      <div className="new-program-form">
        <h2>✨ Nouveau Programme</h2>
        <div className="form-grid">
          <InputNumber value={studyHours} onValueChange={(e) => setStudyHours(e.value)} placeholder="Heures/jour" />
          <InputNumber value={daysUntilExam} onValueChange={(e) => setDaysUntilExam(e.value)} placeholder="Jours restants" />
          <div>
            {["Matin", "Après-midi", "Soir"].map((time) => (
              <span key={time}>
                <RadioButton value={time} onChange={(e) => setPreferredTime(e.value)} checked={preferredTime === time} />
                <label>{time}</label>
              </span>
            ))}
          </div>
          <InputTextarea value={goals} onChange={(e) => setGoals(e.target.value)} placeholder="Vos objectifs..." />
          <Button label="Créer le programme" onClick={handleSubmit} disabled={loading} className="create-btn" />
          {loading && <ProgressSpinner />}
        </div>
      </div>
    </div>
  );
};

export default Program;
