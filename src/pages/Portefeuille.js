import React from 'react';

const Portefeuille = () => {
  return (
    <div style={{ padding: 20, color: '#fff' }}>
      <h1>Portefeuille</h1>
      <p>Bienvenue sur la page Portefeuille.</p>
      <div style={{ marginTop: 20 }}>
        <h2>Résumé des actifs</h2>
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: 10, 
          marginTop: 15,
          maxWidth: 600 
        }}>
          <div style={{ 
            padding: 15, 
            backgroundColor: '#333', 
            borderRadius: 8,
            display: 'flex',
            justifyContent: 'space-between'
          }}>
            <span>Actions</span>
            <span>8,500 €</span>
          </div>
          <div style={{ 
            padding: 15, 
            backgroundColor: '#333', 
            borderRadius: 8,
            display: 'flex',
            justifyContent: 'space-between'
          }}>
            <span>Crypto-monnaies</span>
            <span>2,300 €</span>
          </div>
          <div style={{ 
            padding: 15, 
            backgroundColor: '#333', 
            borderRadius: 8,
            display: 'flex',
            justifyContent: 'space-between'
          }}>
            <span>Épargne</span>
            <span>12,750 €</span>
          </div>
          <div style={{ 
            padding: 15, 
            backgroundColor: '#444', 
            borderRadius: 8,
            display: 'flex',
            justifyContent: 'space-between',
            fontWeight: 'bold'
          }}>
            <span>Total</span>
            <span>23,550 €</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Portefeuille;

