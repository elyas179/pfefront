import axios from "axios";
import { motion } from "framer-motion";
import { Card } from "primereact/card";
import { Dialog } from "primereact/dialog";
import { Chart } from "primereact/chart";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import "./Student.css";

const dashboardItems = [
  { icon: "pi pi-book", label: "mes Cours", to: "/courses" },
  { icon: "pi pi-pencil", label: "Quizzes", to: "/quizes" },
  { icon: "pi pi-comments", label: "Chat Bot", to: "/chat" },
  { icon: "pi pi-question-circle", label: "FAQ", to: "/faq" },
  { icon: "pi pi-chart-line", label: "performance-AI", to: "/performance" },
  { icon: "pi pi-graduation-cap", label: "Program with AI", to: "/Program" },
  { icon: "pi pi-users", label: "Enseignants", to: "/StudentProfessors" },
  { icon: "pi pi-briefcase", label: "Assigner mes Modules", to: "/assign-modules" },
];

const Student = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [editVisible, setEditVisible] = useState(false);
  const [editForm, setEditForm] = useState({ bio: "", background: "" });
  const [profilePhotoUrl, setProfilePhotoUrl] = useState("https://via.placeholder.com/150");

  // Performance stats
  const [stats, setStats] = useState(null);
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      setEditForm({ bio: parsedUser.bio || "", background: parsedUser.background || "" });
      setProfilePhotoUrl(parsedUser.profile_photo || "https://via.placeholder.com/150");
    }
  }, []);

  useEffect(() => {
    // Fetch performance stats
    const fetchStats = async () => {
      setLoadingStats(true);
      try {
        const token = localStorage.getItem("accessToken");
        const res = await axios.get("http://127.0.0.1:8000/api/ai/performance/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStats(res.data);
      } catch (err) {
        setStats(null);
      } finally {
        setLoadingStats(false);
      }
    };
    fetchStats();
  }, []);

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm({ ...editForm, [name]: value });
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const tempUrl = URL.createObjectURL(file);
      setProfilePhotoUrl(tempUrl);

      const token = localStorage.getItem("access_token");
      const formData = new FormData();
      formData.append("profile_photo", file);

      axios
        .patch("http://127.0.0.1:8000/api/users/me/edit/", formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        })
        .then((res) => {
          const updatedUser = { ...user, profile_photo: res.data.profile_photo };
          setUser(updatedUser);
          localStorage.setItem("user", JSON.stringify(updatedUser));
        })
        .catch((err) => {
          // ignore
        });
    }
  };

  const handleSaveProfile = async () => {
    try {
      const token = localStorage.getItem("access_token");
      const formData = new FormData();
      formData.append("bio", editForm.bio);
      formData.append("background", editForm.background);

      await axios.patch("http://127.0.0.1:8000/api/users/me/edit/", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      const updatedUser = { ...user, bio: editForm.bio, background: editForm.background };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);
      setEditVisible(false);
    } catch (error) {}
  };

  const goToAnnouncements = () => {
    navigate("/announcements");
  };

  // Chart Data
  const chartData = {
    labels: ["Forts", "Faibles", "Irréguliers"],
    datasets: [
      {
        label: "Modules",
        backgroundColor: ["#22c55e", "#ef4444", "#f59e0b"],
        data: [
          stats?.strong_modules?.length || 0,
          stats?.weak_modules?.length || 0,
          stats?.inconsistent_modules?.length || 0,
        ],
      },
    ],
  };
  const lineChart = {
    labels: stats?.recent_scores?.map((s) => s.quiz) || [],
    datasets: [
      {
        label: "Scores récents",
        data: stats?.recent_scores?.map((s) => s.score) || [],
        fill: false,
        borderColor: "#a259e8",
        backgroundColor: "#a259e8",
        tension: 0.4,
      },
    ],
  };

  return (
    <div className="student-page">
      <motion.div
        className="student-dashboard"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5 }}
      >
        <div className="dashboard-header">
          <h1 className="dashboard-title">
            Bienvenue{" "}
            <span
              style={{ cursor: "pointer", textDecoration: "underline" }}
              onClick={() => setEditVisible(true)}
            >
              {user?.first_name || user?.username || "Étudiant"}
            </span>{" "}
            🎓
          </h1>
          <p className="dashboard-subtext">Voici votre tableau de bord personnalisé.</p>
        </div>

        {/* --- STATS CARDS ROW --- */}
        <div
          style={{
            width: "100%",
            margin: "0 auto 30px auto",
            display: "flex",
            gap: 24,
            alignItems: "flex-start",
            justifyContent: "center",
            flexWrap: "wrap",
            maxWidth: 800,
          }}
        >
          {/* Moyenne générale */}
          <Card
            style={{
              minWidth: 140,
              maxWidth: 170,
              minHeight: 150,
              padding: "0 8px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 2px 18px 0 #e8d6fc",
              borderRadius: 13,
              overflow: "visible",
            }}
          >
            <div
              style={{
                textAlign: "center",
                fontWeight: 600,
                fontSize: "1.05rem",
                color: "#a259e8",
                marginBottom: 4,
                marginTop: 10,
              }}
            >
              Moyenne
            </div>
            <div style={{ marginTop: 17, marginBottom: 8 }}>
              {loadingStats ? (
                <span
                  className="pi pi-spin pi-spinner"
                  style={{ fontSize: "1.4em", color: "#a259e8" }}
                />
              ) : (
                <span
                  style={{
                    fontWeight: 800,
                    color: "#a259e8",
                    fontSize: 34,
                    background: "#ede2ff",
                    borderRadius: "50%",
                    padding: "12px 18px",
                    boxShadow: "0 1px 8px 0 #f4edff",
                  }}
                >
                  {stats?.average_score ?? "—"}%
                </span>
              )}
            </div>
          </Card>

          {/* Doughnut */}
          <Card
            style={{
              minWidth: 190,
              maxWidth: 210,
              minHeight: 150,
              padding: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 2px 18px 0 #e8d6fc",
              borderRadius: 13,
              overflow: "visible",
            }}
          >
            <div
              style={{
                textAlign: "center",
                fontWeight: 600,
                fontSize: "1.05rem",
                color: "#a259e8",
                marginBottom: 4,
                marginTop: 10,
              }}
            >
              Modules par Catégorie
            </div>
            <div style={{ width: 80, height: 80, margin: "0 auto" }}>
              {loadingStats ? (
                <span
                  className="pi pi-spin pi-spinner"
                  style={{ fontSize: "1.4em", color: "#a259e8" }}
                />
              ) : (
                <Chart
                  type="doughnut"
                  data={chartData}
                  options={{
                    responsive: false,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                  }}
                  width={80}
                  height={80}
                />
              )}
            </div>
            {/* Custom legend below the chart */}
            {!loadingStats && (
              <div style={{ marginTop: 5, marginBottom: 6 }}>
                <div style={{ display: "flex", alignItems: "center", fontSize: 11, gap: 7 }}>
                  <div style={{ width: 18, height: 4, background: "#22c55e", borderRadius: 2 }} /> Forts
                </div>
                <div style={{ display: "flex", alignItems: "center", fontSize: 11, gap: 7 }}>
                  <div style={{ width: 18, height: 4, background: "#ef4444", borderRadius: 2 }} /> Faibles
                </div>
                <div style={{ display: "flex", alignItems: "center", fontSize: 11, gap: 7 }}>
                  <div style={{ width: 18, height: 4, background: "#f59e0b", borderRadius: 2 }} /> Irréguliers
                </div>
              </div>
            )}
          </Card>

          {/* Scores */}
          <Card
            style={{
              minWidth: 190,
              maxWidth: 210,
              minHeight: 150,
              padding: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 2px 18px 0 #e8d6fc",
              borderRadius: 13,
              overflow: "visible",
            }}
          >
            <div
              style={{
                textAlign: "center",
                fontWeight: 600,
                fontSize: "1.05rem",
                color: "#a259e8",
                marginBottom: 4,
                marginTop: 10,
              }}
            >
              Évolution des Scores
            </div>
            <div style={{ width: 135, height: 82 }}>
              {loadingStats ? (
                <span
                  className="pi pi-spin pi-spinner"
                  style={{ fontSize: "1.4em", color: "#a259e8" }}
                />
              ) : (
                <Chart
                  type="line"
                  data={lineChart}
                  options={{
                    responsive: false,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: { display: false },
                    },
                    scales: {
                      x: {
                        ticks: {
                          font: { size: 10 },
                          color: "#aaa",
                        },
                      },
                      y: {
                        ticks: {
                          font: { size: 10 },
                          color: "#aaa",
                        },
                      },
                    },
                  }}
                  width={135}
                  height={80}
                />
              )}
            </div>
          </Card>
        </div>
        {/* --- END STATS CARDS --- */}

        <div style={{ textAlign: "center", marginTop: "0.5rem", marginBottom: "2rem" }}>
          <button onClick={goToAnnouncements} className="auth-button-filled">
            📢 Annonces de vos professeurs
          </button>
        </div>

        {/* --- DASHBOARD CARDS --- */}
        <div className="dashboard-grid">
          {dashboardItems.map((item, index) => (
            <Card
              key={index}
              className="dashboard-card"
              onClick={() => item.to && navigate(item.to)}
              style={{ cursor: item.to ? "pointer" : "default" }}
            >
              <i className={`pi ${item.icon} card-icon`}></i>
              <p>{item.label}</p>
            </Card>
          ))}
        </div>

        {/* --- PROFILE EDIT MODAL --- */}
        <Dialog
          header="Modifier mon profil"
          visible={editVisible}
          style={{ width: "400px" }}
          onHide={() => setEditVisible(false)}
        >
          <div className="edit-profile-form">
            <label>Bio</label>
            <textarea
              name="bio"
              value={editForm.bio}
              onChange={handleEditChange}
              rows={3}
              style={{ width: "100%", marginBottom: "1rem" }}
            />

            <div className="profile-picture-container">
              <img src={profilePhotoUrl} alt="Profil étudiant" className="profile-picture" />
              <div className="overlay">
                <label htmlFor="photo-upload" className="edit-icon">⚙️</label>
                <input
                  id="photo-upload"
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={handlePhotoUpload}
                />
              </div>
            </div>

            <label>Background</label>
            <textarea
              name="background"
              value={editForm.background}
              onChange={handleEditChange}
              rows={3}
              style={{ width: "100%", marginBottom: "1rem" }}
            />

            <button onClick={handleSaveProfile} className="auth-button-filled">
              Sauvegarder
            </button>
          </div>
        </Dialog>
      </motion.div>
    </div>
  );
};

export default Student;
