import React, { useEffect, useState } from "react";
import axios from "axios";
import "./TeacherStudents.css";

const TeacherStudents = () => {
  const [students, setStudents] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("accessToken");

  const SPECIALITY_MAP = {
  1: "ACAD",
  2: "",
  3: "ISIL",
  4: "TRONC-COMMUN"
};

const LEVEL_MAP = {
  4: "L1-S1",
  5: "L1-S2",
  6: "L2-S3",
  7: "L2-S4",
  2: "L3-S5",
  13: "L3-S6"

};

  const fetchStudents = async (search = "") => {
    try {
      setLoading(true);
      const res = await axios.get(`http://127.0.0.1:8000/api/users/search/students/?q=${search}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStudents(res.data);
    } catch (err) {
      console.error("Erreur lors du chargement des étudiants:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents(); // Initial load
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchStudents(query.trim());
  };

  return (
    <div className="teacher-students-container">
      <h2>👩‍🎓 Liste des étudiants</h2>

      <form className="student-search-bar" onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="🔍 Rechercher un étudiant..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button type="submit">Rechercher</button>
      </form>

      {loading ? (
        <div className="loading-text">⏳ Chargement...</div>
      ) : students.length === 0 ? (
        <div className="no-results">❌ Aucun étudiant trouvé.</div>
      ) : (
        <div className="student-card-grid">
          {students.map((student) => (
            <div key={student.id} className="student-card">
              <div className="student-photo">
                {student.profile_photo ? (
                  <img src={`http://127.0.0.1:8000${student.profile_photo}`} alt="profil" />
                ) : (
                  <div className="default-avatar">👤</div>
                )}
              </div>
              <div className="student-info">
  <h3>{student.username}</h3>
  <p>{student.first_name || "-"} {student.last_name || ""}</p>
  <p>✉️ {student.email || "—"}</p>
  <p>🎓 Spécialité : {SPECIALITY_MAP[student.speciality] ?? "—"}</p>
<p>📘 Niveau : {LEVEL_MAP[student.level] ?? "—"}</p>
</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TeacherStudents;
