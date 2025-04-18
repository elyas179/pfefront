// File: Login.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AuthForm.css';
import { motion } from 'framer-motion';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [role, setRole] = useState('etudiant');
  const [file, setFile] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Login:', formData, 'Role:', role, 'File:', file);

    if (role === 'etudiant') {
      navigate('/student');
    } else {
      // Tu peux rediriger ailleurs ici pour prof
      alert('Connexion en tant que professeur');
    }
  };

  return (
    <motion.div
      className="auth-container"
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.5 }}
    >
      <div className="auth-left">
        <h1>Hello, Friend!</h1>
        <p>Enter your personal details and start your journey with us</p>
        <button
          className="auth-button-outlined"
          onClick={() => navigate('/register')}
        >
          SIGN UP
        </button>
      </div>

      <div className="auth-right">
        <div className="social-icons">
          <i className="pi pi-facebook" style={{ color: "#3b5998" }}></i>
          <i className="pi pi-google" style={{ color: "#db4437" }}></i>
          <i className="pi pi-linkedin" style={{ color: "#0e76a8" }}></i>
        </div>

        <h2>Sign In</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          
          <div className="role-select">
            <label>
              <input
                type="radio"
                name="role"
                value="etudiant"
                checked={role === 'etudiant'}
                onChange={(e) => setRole(e.target.value)}
              />
              Étudiant
            </label>
            <label>
              <input
                type="radio"
                name="role"
                value="professeur"
                checked={role === 'professeur'}
                onChange={(e) => setRole(e.target.value)}
              />
              Professeur
            </label>
          </div>

          <a href="#" className="forgot">Mot de passe oublié ?</a>
          <button className="auth-button-filled" type="submit">LOGIN</button>
        </form>
      </div>
    </motion.div>
  );
};

export default Login;
