import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import './AnnouncementsPage.css';

const AnnouncementsPage = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const userStr = localStorage.getItem("user");
    let user = null;

    try {
      user = JSON.parse(userStr);
    } catch (e) {
      console.error("Invalid user in localStorage");
    }

    if (!token || !user) {
      console.warn("🚫 Not authenticated. Redirecting...");
      navigate("/login");
      return;
    }

    // Mark all notifications as read
    fetch("http://127.0.0.1:8000/notifications/mark-all-read/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }).catch((err) => {
      console.error("Mark read error:", err);
    });

    // Fetch all announcements
    fetch("http://127.0.0.1:8000/notifications/my-announcements/", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
        return res.json();
      })
      .then((data) => setAnnouncements(data))
      .catch((err) => {
        console.error("❌ Error fetching announcements:", err);
        setError("Failed to fetch announcements.");
      });
  }, [navigate]);

  return (
    <div className={`announcements-wrapper ${document.body.className}`}>
      <h2>📢 Vos Annonces</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      
      {announcements.length === 0 ? (
        <p>Aucune annonce à afficher.</p>
      ) : (
        <ul style={{ listStyle: "none", paddingLeft: 0 }}>
          {announcements.map((announcement, index) => (
            <li key={index} className="announcement-card">
              {(() => {
  const parts = announcement.message?.split(":");
  const title = parts?.[0]?.trim() || "Sans titre";
  const content = parts?.slice(1).join(":").trim() || "Pas de contenu.";
  return (
    <>
      <div className="announcement-title">{title}</div>
      <div className="announcement-message">{content}</div>
    </>
  );
})()}

            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AnnouncementsPage;
