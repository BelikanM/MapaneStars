import React, { useEffect, useState } from 'react';
import * as AppwriteAPI from './AppwriteAPI';
import { FaEdit, FaTrash } from 'react-icons/fa';

function Update() {
  const [videos, setVideos] = useState([]);
  const [newCaption, setNewCaption] = useState('');

  useEffect(() => {
    const fetchVideos = async () => {
      const user = await AppwriteAPI.getCurrentUser();
      const allVideos = await AppwriteAPI.getFeed();
      const userVideos = allVideos.filter(video => video.userId === user.$id);
      setVideos(userVideos);
    };
    fetchVideos();
  }, []);

  const handleUpdateCaption = async (id) => {
    if (!newCaption) {
      alert('Veuillez saisir une nouvelle description.');
      return;
    }
    await AppwriteAPI.updateVideoCaption(id, newCaption);
    alert('Description mise à jour.');
    setNewCaption('');
    window.location.reload();
  };

  const handleDelete = async (id) => {
    if (window.confirm('Confirmer la suppression de cette vidéo ?')) {
      await AppwriteAPI.deleteVideo(id);
      alert('Vidéo supprimée.');
      window.location.reload();
    }
  };

  return (
    <div style={{ textAlign: 'center' }}>
      {videos.map(video => (
        <div key={video.$id} style={{ marginBottom: '20px', backgroundColor: '#1f1f1f', padding: '10px', borderRadius: '8px' }}>
          <video width="300" controls src={video.videoUrl}></video>
          <p>{video.caption}</p>
          <input type="text" placeholder="Nouvelle description..." value={newCaption} onChange={(e) => setNewCaption(e.target.value)} style={{ padding: '5px', marginBottom: '10px' }} /><br />
          <button onClick={() => handleUpdateCaption(video.$id)} style={buttonStyle}><FaEdit style={{ marginRight: '5px' }} />Modifier</button>
          <button onClick={() => handleDelete(video.$id)} style={{ ...buttonStyle, backgroundColor: '#b00020', marginLeft: '10px' }}>
            <FaTrash style={{ marginRight: '5px' }} />Supprimer
          </button>
        </div>
      ))}
    </div>
  );
}

const buttonStyle = {
  padding: '8px 16px',
  backgroundColor: '#e50914',
  color: '#fff',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  display: 'inline-flex',
  alignItems: 'center',
};

export default Update;
