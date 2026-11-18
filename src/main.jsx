import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import MontanesPropiedades from './MontanesPropiedades.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <MontanesPropiedades />
  </StrictMode>
);
