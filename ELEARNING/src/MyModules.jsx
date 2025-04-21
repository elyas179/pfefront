// File: MyModules.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Carousel } from "primereact/carousel";
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import "./MyModules.css";

const MyModules = () => {
  const [modules, setModules] = useState([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("accessToken"); // ⬅️ Récupère le token

    if (token) {
      axios
        .get("http://127.0.0.1:8000/api/users/my-modules", {
          headers: {
            Authorization: `Bearer ${token}`, // ⬅️ Ajoute le token ici
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
    <Card className="module-card">
      <div className="icon-container">
        <i className="pi pi-book module-icon"></i>
      </div>
      <p>{mod.name}</p>
    </Card>
  );

  return (
    <div className="my-modules-wrapper">
      <h1 className="main-title">📚 Mes Modules</h1>

      <div className="search-bar center">
        <InputText
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="🔍 Rechercher un module..."
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
        <p className="no-modules">Aucun module trouvé</p>
      )}
    </div>
  );
};

export default MyModules;
