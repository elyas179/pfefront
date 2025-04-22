// File: MyModules.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Carousel } from "primereact/carousel";
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import "./MyModules.css";

const MyModules = () => {
  const [modules, setModules] = useState([]);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    if (token) {
      axios
        .get("http://127.0.0.1:8000/api/users/my-modules", {
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
    }
  }, []);

  const filteredModules = modules.filter((m) =>
    m.name.toLowerCase().includes(query.toLowerCase())
  );

  const moduleTemplate = (mod) => (
    <motion.div
      className="module-card"
      whileHover={{ scale: 1.05 }}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      onClick={() => navigate(`/modules/${mod.id}`)}
      style={{ cursor: "pointer" }}
    >
      <div className="icon-container">
        <i className="pi pi-book module-icon"></i>
      </div>
      <p>{mod.name}</p>
    </motion.div>
  );

  return (
    <div className="my-modules-wrapper">
      <h1 className="main-title">📚 Mes Modules</h1>

      <div className="search-bar">
        <InputText
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="🔍 Rechercher un module..."
          className="module-search-input"
        />
      </div>

      {filteredModules.length > 0 ? (
        <Carousel
          value={filteredModules}
          itemTemplate={moduleTemplate}
          numVisible={3}
          circular
          autoplayInterval={5000}
          showIndicators={false}
          showNavigators={true}
        />
      ) : (
        <p className="no-modules">Aucun module trouvé.</p>
      )}
    </div>
  );
};

export default MyModules;
