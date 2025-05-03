import React, { useEffect, useState } from "react";
import axios from "axios";
import { Carousel } from "primereact/carousel";
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import "./MyModules.css";

const MyModules = () => {
  const [modules, setModules] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchModules = (searchQuery = "") => {
    const token = localStorage.getItem("accessToken");
    if (!token) return;

    axios
      .get(`http://127.0.0.1:8000/api/users/my-modules/?search=${searchQuery}`, {
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

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchModules(query);
    }, 400);

    return () => clearTimeout(delayDebounce);
  }, [query]);

  const moduleTemplate = (mod) => (
    <Card className="module-card" key={mod.id}>
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

      <div className="assign-button center">
        <Button
          label="📥 M’assigner mes modules"
          icon="pi pi-download"
          onClick={assignModules}
          loading={loading}
          className="p-button-rounded p-button-info"
        />
      </div>

      {modules.length > 0 ? (
        <Carousel
          value={modules}
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
