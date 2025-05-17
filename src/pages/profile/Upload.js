import React, { useState } from 'react';
import * as AppwriteAPI from './AppwriteAPI';
import { FiUploadCloud } from 'react-icons/fi';

function Upload() {
  const [caption, setCaption] = useState('');
  const [file, setFile] = useState(null);

  const handleUpload = async () => {
    if (!file || !caption) {
      alert('Sélectionnez un fichier et ajoutez une description.');
      return;
    }
    try {
      const user = await AppwriteAPI.getCurrentUser();
      await AppwriteAPI.uploadVideo(file, user.$id, caption);
      alert('Vidéo uploadée avec succès.');
      setCaption('');
      setFile(null);
    } catch (error) {
      alert('Erreur lors de l\'upload.');
    }
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <input type="file" accept="video/*" onChange={(e) => setFile(e.target.files[0])} style={{ marginBottom: '10px' }} /><br />
      <input type="text" placeholder="Description..." value={caption} onChange={(e) => setCaption(e.target.value)} style={{ width: '300px', padding: '8px', marginBottom: '10px' }} /><br />
      <button onClick={handleUpload} style={buttonStyle}>
        <FiUploadCloud size={20} style={{ marginRight: '8px' }} /> Publier
      </button>
    </div>
  );
}

const buttonStyle = {
  padding: '10px 20px',
  backgroundColor: '#e50914',
  color: '#fff',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

export default Upload;
