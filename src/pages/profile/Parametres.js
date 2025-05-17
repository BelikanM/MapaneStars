import React, { useState } from 'react';
import * as AppwriteAPI from './AppwriteAPI';
import { FiUser, FiLock } from 'react-icons/fi';

function Parametres() {
  const [password, setPassword] = useState('');
  const [photo, setPhoto] = useState(null);

  const handleChangePassword = async () => {
    if (!password) {
      alert('Entrez un nouveau mot de passe.');
      return;
    }
    try {
      await AppwriteAPI.changePassword(password);
      alert('Mot de passe mis à jour.');
      setPassword('');
    } catch (err) {
      alert('Erreur lors de la mise à jour du mot de passe.');
    }
  };

  const handlePhotoUpload = async () => {
    if (!photo) {
      alert('Sélectionnez une photo.');
      return;
    }
    try {
      const user = await AppwriteAPI.getCurrentUser();
      await AppwriteAPI.updateProfilePhoto(user.$id, photo);
      alert('Photo de profil mise à jour.');
    } catch (err) {
      alert('Erreur lors de la mise à jour de la photo.');
    }
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <h3>Changer le Mot de Passe</h3>
      <input
        type="password"
        placeholder="Nouveau mot de passe..."
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={inputStyle}
      /><br />
      <button onClick={handleChangePassword} style={buttonStyle}>
        <FiLock style={{ marginRight: '5px' }} /> Changer le Mot de Passe
      </button>

      <h3 style={{ marginTop: '30px' }}>Changer la Photo de Profil</h3>
      <input type="file" accept="image/*" onChange={(e) => setPhoto(e.target.files[0])} style={{ marginBottom: '10px' }} /><br />
      <button onClick={handlePhotoUpload} style={buttonStyle}>
        <FiUser style={{ marginRight: '5px' }} /> Mettre à Jour la Photo
      </button>
    </div>
  );
}

const inputStyle = {
  width: '300px',
  padding: '8px',
  marginBottom: '10px',
};

const buttonStyle = {
  padding: '10px 20px',
  backgroundColor: '#e50914',
  color: '#fff',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  display: 'inline-flex',
  alignItems: 'center',
};

export default Parametres;
