import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';

// Import des pages
import Profile from './pages/Profile';
import Actualites from './pages/Actualites';
import StartQuartier from './pages/StartQuartier';
import Portefeuille from './pages/Portefeuille';

// Styles pour l'application
const appStyle = {
  backgroundColor: '#000',
  minHeight: '100vh',
  color: '#fff',
  fontFamily: "'Roboto', sans-serif"
};

function App() {
  return (
    <Router>
      <div style={appStyle}>
        <Navbar />
        <div className="content">
          <Routes>
            <Route path="/profile" element={<Profile />} />
            <Route path="/actualites" element={<Actualites />} />
            <Route path="/start-quartier" element={<StartQuartier />} />
            <Route path="/portefeuille" element={<Portefeuille />} />
            {/* Redirection par défaut vers Actualités */}
            <Route path="/" element={<Navigate to="/actualites" replace />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;

