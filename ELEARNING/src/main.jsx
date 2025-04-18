import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import 'primereact/resources/themes/lara-light-indigo/theme.css'; // thème
import 'primereact/resources/primereact.min.css'; // composants
import 'primeicons/primeicons.css'; // icônes
import 'primeflex/primeflex.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
