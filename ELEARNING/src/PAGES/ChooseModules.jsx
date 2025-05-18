import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card } from "primereact/card";
import { Checkbox } from "primereact/checkbox";
import { Button } from "primereact/button";
import { motion } from "framer-motion";
import "./ChooseModules.css";

const ChooseModules = () => {
  const [allModules, setAllModules] = useState([]);
  const [selectedModules, setSelectedModules] = useState([]);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("accessToken");

  useEffect(() => {
    if (!token) return;

    // Fetch ALL modules
    axios
      .get("http://127.0.0.1:8000/api/courses/modules/", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setAllModules(res.data || []))
      .catch((err) => console.error("Erreur chargement modules:", err));

    // Fetch assigned modules
    axios
      .get("http://127.0.0.1:8000/api/users/choosemodules/", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const ids = Array.isArray(res.data) ? res.data.map((m) => m.id) : [];
        setSelectedModules(ids);
      })
      .catch((err) => console.error("Erreur chargement modules affectés:", err));
  }, []);

  const handleToggle = (id) => {
    setSelectedModules((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]
    );
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await axios.post(
        "http://127.0.0.1:8000/api/users/choosemodules/",
        { module_ids: selectedModules },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("✅ Modules enregistrés avec succès !");
    } catch (err) {
      console.error("Erreur assignation modules:", err);
      alert("❌ Échec de l'enregistrement.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="choose-modules-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="choose-title">📚 Choisir les modules que vous enseignez</h2>
      <div className="modules-grid">
        {allModules.map((mod) => (
          <Card key={mod.id} className="module-card">
            <div className="module-info">
              <Checkbox
                inputId={`mod-${mod.id}`}
                checked={selectedModules.includes(mod.id)}
                onChange={() => handleToggle(mod.id)}
              />
              <label htmlFor={`mod-${mod.id}`} className="module-label">{mod.name}</label>
              {mod.description && (
                <p className="module-description">{mod.description}</p>
              )}
            </div>
          </Card>
        ))}
      </div>
      <Button
        className="auth-button-filled"
        label={loading ? "Enregistrement..." : "Enregistrer mes modules"}
        onClick={handleSubmit}
        disabled={loading || selectedModules.length === 0}
      />
    </motion.div>
  );
};

export default ChooseModules;
