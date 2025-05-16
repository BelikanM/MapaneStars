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

// Styles CSS en objet
const styles = {
  navbar: {
    backgroundColor: '#141414',
    display: 'flex',
    alignItems: 'center',
    padding: '0 20px',
    height: 60,
    color: 'white',
    fontFamily: "'Roboto', sans-serif",
    fontWeight: 'bold'
  },
  logo: {
    marginRight: 30,
    display: 'flex',
    alignItems: 'center',
  },
  navLinks: {
    display: 'flex',
    gap: 25,
  },
  link: {
    color: 'white',
    textDecoration: 'none',
    fontSize: 18,
    paddingBottom: 2,
    borderBottom: '3px solid transparent',
    transition: 'border-color 0.3s',
  },
  activeLink: {
    borderBottom: '3px solid #E50914', // rouge Netflix
  },
};

const Navbar = () => {
  return (
    <nav style={styles.navbar}>
      <div style={styles.logo}>
        <AnimatedStar />
      </div>
      <div style={styles.navLinks}>
        <NavLink to="/profile" style={styles.link} activeStyle={styles.activeLink}>
          Profile
        </NavLink>
        <NavLink to="/actualites" style={styles.link} activeStyle={styles.activeLink}>
          Actualités
        </NavLink>
        <NavLink to="/start-quartier" style={styles.link} activeStyle={styles.activeLink}>
          Start Quartier
        </NavLink>
        <NavLink to="/portefeuille" style={styles.link} activeStyle={styles.activeLink}>
          Portefeuille
        </NavLink>
      </div>

      {/* Animation spin keyframes global */}
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </nav>
  );
};

export default Navbar;

