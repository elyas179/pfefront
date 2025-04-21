// File: Register.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import './AuthForm.css';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'etudiant',
    level: '',
    speciality: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) return;

    try {
      const response = await axios.post('http://127.0.0.1:8000/api/users/register/', formData);
      console.log('Inscription réussie:', response.data);
      if (formData.role === 'etudiant') navigate('/student');
    } catch (error) {
      console.error("Erreur d'inscription:", error);
    }
  };

  return (
    <motion.div className="auth-container" initial={{ opacity: 0, x: 100 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -100 }} transition={{ duration: 0.5 }}>
      <div className="auth-left">
        <h1>Welcome Back!</h1>
        <p>To keep connected with us please login with your personal info</p>
        <button className="auth-button-outlined" onClick={() => navigate('/login')}>SIGN IN</button>
      </div>
      <div className="auth-right">
        <div className="social-icons">
          <i className="pi pi-facebook" style={{ color: "#3b5998" }}></i>
          <i className="pi pi-google" style={{ color: "#db4437" }}></i>
          <i className="pi pi-linkedin" style={{ color: "#0e76a8" }}></i>
        </div>
        <h2>Create Account</h2>
        <form onSubmit={handleSubmit}>
          <input type="text" name="nom" placeholder="Nom" value={formData.nom} onChange={handleChange} required />
          <input type="text" name="prenom" placeholder="Prénom" value={formData.prenom} onChange={handleChange} required />
          <input type="text" name="username" placeholder="Nom d'utilisateur" value={formData.username} onChange={handleChange} required />
          <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
          <input type="password" name="password" placeholder="Mot de passe" value={formData.password} onChange={handleChange} required />
          <input type="password" name="confirmPassword" placeholder="Confirmer le mot de passe" value={formData.confirmPassword} onChange={handleChange} required />
          <div className="select-group">
            <label>Niveau:</label>
            <select name="level" value={formData.level} onChange={handleChange} required>
              <option value="">Choisir un niveau</option>
              <option value="L1">L1</option>
              <option value="L2">L2</option>
              <option value="L3">L3</option>
            </select>
          </div>

          {(formData.level === 'L2' || formData.level === 'L3') && (
            <div className="select-group">
              <label>Spécialité:</label>
              <select name="speciality" value={formData.speciality} onChange={handleChange} required>
                <option value="">Choisir une spécialité</option>
                <option value="ACAD">ACAD</option>
                <option value="ISIL">ISIL</option>
              </select>
            </div>
          )}

          <div className="role-select">
            <label><input type="radio" name="role" value="etudiant" checked={formData.role === 'etudiant'} onChange={handleChange} /> Étudiant</label>
            <label><input type="radio" name="role" value="enseignant" checked={formData.role === 'enseignant'} onChange={handleChange} /> Enseignant</label>
          </div>

          

          <button className="auth-button-filled" type="submit">SIGN UP</button>
        </form>
      </div>
    </motion.div>
  );
};

export default Register;
