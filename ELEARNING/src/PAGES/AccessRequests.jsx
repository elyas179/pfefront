import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import "./AccessRequests.css";

const AccessRequestsPage = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const res = await axios.get("http://127.0.0.1:8000/courses/resources/access-requests/received/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRequests(res.data);
    } catch (err) {
      console.error("Erreur chargement des demandes:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleRequest = async (requestId, approved) => {
    try {
      const token = localStorage.getItem("accessToken");
      await axios.patch(
        `http://127.0.0.1:8000/courses/resources/handle-request/${requestId}/`,
        { approved },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setRequests((prev) => prev.filter((r) => r.id !== requestId));
    } catch (err) {
      console.error("Erreur traitement demande:", err);
      alert("❌ Erreur de traitement.");
    }
  };

  const pendingRequests = requests.filter((r) => r.approved === null);

  if (loading) return <div className="loading">Chargement des demandes...</div>;

  return (
    <div className="access-requests-page">
      <h2>📨 Demandes d'accès reçues</h2>
      {pendingRequests.length === 0 ? (
        <p>Aucune demande en attente.</p>
      ) : (
        pendingRequests.map((req) => (
          <Card key={req.id} className="request-card">
            <div className="request-info">
              <p><strong>Étudiant:</strong> {req.requester}</p>
              <p><strong>Ressource:</strong> {req.resource}</p>
              <p><strong>Date:</strong> {new Date(req.created_at).toLocaleString()}</p>
            </div>
            <div className="request-actions">
              <Button
                label="Accepter"
                icon="pi pi-check"
                className="p-button-success"
                onClick={() => handleRequest(req.id, true)}
              />
              <Button
                label="Refuser"
                icon="pi pi-times"
                className="p-button-danger"
                onClick={() => handleRequest(req.id, false)}
                style={{ marginLeft: "1rem" }}
              />
            </div>
          </Card>
        ))
      )}
    </div>
  );
};

export default AccessRequestsPage;
