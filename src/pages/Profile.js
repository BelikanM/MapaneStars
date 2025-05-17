import React from 'react';
import Auth from './profile/Auth';
import Liste from './profile/Liste';
import Upload from './profile/Upload';
import Update from './profile/Update';
import Parametres from './profile/Parametres';

function Profile() {
  return (
    <div style={{ padding: '20px', backgroundColor: '#141414', color: '#fff', minHeight: '100vh', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '40px' }}>Mon Profil</h1>

      <Auth />

      <section style={sectionStyle}>
        <h2>Uploader du Contenu</h2>
        <Upload />
      </section>

      <section style={sectionStyle}>
        <h2>Liste des Utilisateurs</h2>
        <Liste />
      </section>

      <section style={sectionStyle}>
        <h2>Modifier les Informations</h2>
        <Update />
      </section>

      <section style={sectionStyle}>
        <h2>Paramètres du Compte</h2>
        <Parametres />
      </section>
    </div>
  );
}

const sectionStyle = {
  marginBottom: '40px',
  padding: '20px',
  backgroundColor: '#1f1f1f',
  borderRadius: '8px',
};

export default Profile;
