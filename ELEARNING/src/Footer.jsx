import React from "react";
import { motion } from "framer-motion";
import "./Footer.css";

function Footer() {
  return (
    <motion.footer
      className="footer"
      initial={{ y: 200, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <div className="footer-links">
        <a href="#">Confidentialité</a>
        <span className="divider">|</span>
        <a href="#">Contact</a>
        <span className="divider">|</span>
        <a href="#">Notre but</a>
        <span className="divider">|</span>
        <a href="#">À propos</a>
      </div>
      <p className="footer-copy">© 2025 Curio Learning Platform. Tous droits réservés.</p>
    </motion.footer>
  );
}

export default Footer;
