import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "primereact/button";
import "./MyModules.css";

const MyModules = () => {
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchModules = () => {
    const token = localStorage.getItem("accessToken");
    if (!token) return;

    axios
      .get("http://127.0.0.1:8000/api/users/my-modules/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setModules(res.data);
      })
      .catch((err) => {
        console.error("Erreur de récupération des modules", err);
      });
  };

  const assignModules = () => {
    const token = localStorage.getItem("accessToken");
    if (!token) return;

    setLoading(true);
    axios
      .post("http://127.0.0.1:8000/api/users/assign-my-modules/", {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(() => {
        fetchModules();
      })
      .catch((err) => {
        console.error("Erreur lors de l’assignation des modules", err);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchModules();
  }, []);

  return (
    <div className="modules-page">
      <h1 className="modules-title">🔥 Mes Modules</h1>

      <div className="modules-assign-container">
        <Button
          label="📥 M'assigner mes modules"
          icon="pi pi-download"
          onClick={assignModules}
          loading={loading}
          className="modules-assign-btn"
        />
      </div>

      {modules.length > 0 ? (
        <div className="modules-grid">
          {modules.map((mod) => (
            <div key={mod.id} className="module-card">
              <div className="module-icon">
                <i className="pi pi-book" />
              </div>
              <h3>{mod.name}</h3>
            </div>
          ))}
        </div>
      ) : (
        <p className="no-modules">Aucun module trouvé</p>
      )}
    </div>
  );
};

export default MyModules;
