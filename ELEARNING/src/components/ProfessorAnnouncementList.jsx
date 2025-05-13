import React, { useEffect, useState } from "react";
import axios from "axios"; // or your custom axiosInstance

export default function ProfessorAnnouncementList({ professorId }) {
  const [announcements, setAnnouncements] = useState([]); // ✅ make sure it's an array
  const [error, setError] = useState("");

  useEffect(() => {
    if (!professorId) return;

    axios
      .get(`http://127.0.0.1:8000/notifications/by-professor/${professorId}/`)
      .then((res) => {
        console.log("✅ Announcements:", res.data);

        // Make sure it's an array before mapping
        if (Array.isArray(res.data)) {
          setAnnouncements(res.data);
        } else {
          console.warn("Response is not an array:", res.data);
          setAnnouncements([]);
        }
      })
      .catch((err) => {
        console.error("❌ Failed to load announcements:", err);
        setError("Erreur lors du chargement des annonces.");
      });
  }, [professorId]);

  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!announcements.length) return <p>Aucune annonce disponible.</p>;

  return (
    <div>
      {announcements.map((a) => (
        <div key={a.id} className="card mb-3">
          <div className="card-body">
            <h5>{a.title}</h5>
            <p>{a.content}</p>
            <small>{new Date(a.created_at).toLocaleString()}</small>
            <br />
            <span className="badge bg-secondary">
              🎓 {a.level || "Tous niveaux"} - {a.speciality || "Général"}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
