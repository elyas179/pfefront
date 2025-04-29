// File: ResourceDetail.jsx
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { ProgressSpinner } from "primereact/progressspinner";
import { Tag } from "primereact/tag";
import { motion } from "framer-motion";
import "./ResourceDetail.css";

const ResourceDetail = () => {
  const { id } = useParams();
  const [resource, setResource] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`http://127.0.0.1:8000/api/courses/resources/${id}/`)
      .then((res) => {
        setResource(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Erreur de chargement de la ressource:", err);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="resource-detail-loading">
        <ProgressSpinner />
      </div>
    );
  }

  if (!resource) {
    return <div className="resource-error">🚫 Ressource introuvable</div>;
  }

  // Fonction pour convertir un lien YouTube en embed
  const getYoutubeEmbedUrl = (url) => {
    if (!url) return null;
    const videoId = url.split("v=")[1]?.split("&")[0] || url.split("/").pop();
    return `https://www.youtube.com/embed/${videoId}`;
  };

  // Vérification du type
  const isVideo = resource.resource_type.includes('video');
  const isPdf = resource.resource_type.includes('pdf');

  return (
    <motion.div
      className="resource-detail-container"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="resource-title">📄 {resource.name}</h1>

      <div style={{ marginBottom: "1rem" }}>
        <Tag
          value={resource.resource_type.toUpperCase()}
          severity={isVideo ? "info" : "success"}
          style={{ fontSize: "1rem", padding: "0.5rem 1rem" }}
        />
      </div>

      {/* Si c'est une vidéo */}
      {isVideo && (
        <div className="video-container">
          <iframe
            src={getYoutubeEmbedUrl(resource.link)}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title="Video Resource"
          ></iframe>
        </div>
      )}

      {/* Si c'est un PDF */}
      {isPdf && (
        <a
          href={resource.link}
          target="_blank"
          rel="noopener noreferrer"
          className="open-link"
        >
          📄 Ouvrir le document PDF
        </a>
      )}

    </motion.div>
  );
};

export default ResourceDetail;
