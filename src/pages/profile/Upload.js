import React, { useState } from 'react';
import axios from 'axios';

export default function Upload() {
    const [caption, setCaption] = useState('');
    const [file, setFile] = useState(null);

    const handleUpload = () => {
        if (!file) return alert('Sélectionnez une vidéo.');

        const formData = new FormData();
        formData.append('video', file);
        formData.append('caption', caption);
        formData.append('user_id', 1); // Remplacer avec l'ID utilisateur actuel

        axios.post('http://localhost:3000/api/videos/upload', formData)
            .then(() => alert('Vidéo uploadée avec succès.'))
            .catch(err => console.error(err));
    };

    return (
        <div>
            <h2>Uploader une Vidéo</h2>
            <input type="text" placeholder="Légende" value={caption} onChange={e => setCaption(e.target.value)} />
            <br /><br />
            <input type="file" accept="video/*" onChange={e => setFile(e.target.files[0])} />
            <br /><br />
            <button onClick={handleUpload}>Uploader</button>
        </div>
    );
}
