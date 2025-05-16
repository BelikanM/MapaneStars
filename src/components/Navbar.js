import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';

// Simple étoile React SVG animée (rotation + couleur changeant en boucle)
const AnimatedStar = () => {
  const [colorIndex, setColorIndex] = useState(0);
  const colors = ['#FF0000', '#00FF00', '#0000FF']; // rouge, vert, bleu

  useEffect(() => {
    const interval = setInterval(() => {
      setColorIndex(i => (i + 1) % colors.length);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <svg
      style={{ animation: 'spin 4s linear infinite', fill: colors[colorIndex], width: 30, height: 30 }}
      viewBox="0 0 24 24"
    >
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.56 5.82 22 7 14.14l-5-4.87 6.91-1.01L12 2z" />
    </svg>
  );
};

// Icônes SVG pour chaque section
const ProfileIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
  </svg>
);

const NewsIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M22 3H2c-1.1 0-1.99.9-1.99 2L0 17c0 1.1.9 2 2 2h20c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-2 14H4V7h16v10z" />
    <path d="M6 10h9v2H6zm0 4h9v2H6z" />
  </svg>
);

const QuartierIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 7V3H2v18h20V7H12zM6 19H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V9h2v2zm0-4H4V5h2v2zm4 12H8v-2h2v2zm0-4H8v-2h2v2zm0-4H8V9h2v2zm0-4H8V5h2v2zm10 12h-8v-2h2v-2h-2v-2h2v-2h-2V9h8v10zm-2-8h-2v2h2v-2zm0 4h-2v2h2v-2z" />
  </svg>
);

const WalletIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M21 18v1c0 1.1-.9 2-2 2H5c-1.11 0-2-.9-2-2V5c0-1.1.89-2 2-2h14c1.1 0 2 .9 2 2v1h-9c-1.11 0-2 .9-2 2v8c0 1.1.89 2 2 2h9zm-9-2h10V8H12v8zm4-2.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" />
  </svg>
);

const Navbar = () => {
  const [isMobile, setIsMobile] = useState(false);

  // Détecter la taille d'écran
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    // Vérifier la taille initiale
    checkScreenSize();
    
    // Ajouter un écouteur pour les changements de taille
    window.addEventListener('resize', checkScreenSize);
    
    // Nettoyer l'écouteur
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  return (
    <nav style={{
      backgroundColor: '#141414',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 20px',
      height: 60,
      color: 'white',
      fontFamily: "'Roboto', sans-serif",
      fontWeight: 'bold',
      width: '100%',
      position: 'sticky',
      top: 0,
      zIndex: 1000
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
      }}>
        <AnimatedStar />
      </div>

      <div style={{
        display: 'flex',
        gap: isMobile ? '15px' : '25px',
        justifyContent: 'center',
        flexGrow: 1
      }}>
        <NavLink 
          to="/profile" 
          style={({ isActive }) => ({
            color: 'white',
            textDecoration: 'none',
            fontSize: isMobile ? 14 : 18,
            paddingBottom: 2,
            borderBottom: isActive ? '3px solid #E50914' : '3px solid transparent',
            transition: 'border-color 0.3s',
            display: 'flex',
            alignItems: 'center',
            gap: '5px'
          })}
        >
          <ProfileIcon />
          {!isMobile && "Profile"}
        </NavLink>

        <NavLink 
          to="/actualites" 
          style={({ isActive }) => ({
            color: 'white',
            textDecoration: 'none',
            fontSize: isMobile ? 14 : 18,
            paddingBottom: 2,
            borderBottom: isActive ? '3px solid #E50914' : '3px solid transparent',
            transition: 'border-color 0.3s',
            display: 'flex',
            alignItems: 'center',
            gap: '5px'
          })}
        >
          <NewsIcon />
          {!isMobile && "Actualités"}
        </NavLink>

        <NavLink 
          to="/start-quartier" 
          style={({ isActive }) => ({
            color: 'white',
            textDecoration: 'none',
            fontSize: isMobile ? 14 : 18,
            paddingBottom: 2,
            borderBottom: isActive ? '3px solid #E50914' : '3px solid transparent',
            transition: 'border-color 0.3s',
            display: 'flex',
            alignItems: 'center',
            gap: '5px'
          })}
        >
          <QuartierIcon />
          {!isMobile && "Start Quartier"}
        </NavLink>

        <NavLink 
          to="/portefeuille" 
          style={({ isActive }) => ({
            color: 'white',
            textDecoration: 'none',
            fontSize: isMobile ? 14 : 18,
            paddingBottom: 2,
            borderBottom: isActive ? '3px solid #E50914' : '3px solid transparent',
            transition: 'border-color 0.3s',
            display: 'flex',
            alignItems: 'center',
            gap: '5px'
          })}
        >
          <WalletIcon />
          {!isMobile && "Portefeuille"}
        </NavLink>
      </div>

      {/* Animation spin keyframes global */}
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          
          @media (max-width: 768px) {
            nav {
              padding: 0 10px;
            }
          }
        `}
      </style>
    </nav>
  );
};

export default Navbar;

