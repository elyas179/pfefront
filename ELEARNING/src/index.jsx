import 'primereact/resources/themes/lara-light-indigo/theme.css'; // thème
import 'primereact/resources/primereact.min.css'; // composants
import 'primeicons/primeicons.css'; // icônes
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css"; // ou ton CSS global

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
