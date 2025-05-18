import React, { useState } from 'react';
import axios from 'axios';

export default function Update() {
    const [email, setEmail] = useState('');
    const [file, setFile] = useState(null);

    const handlePhotoChange = () => {
        if (!file) {
            alert('Sélectionnez une nouvelle photo.');
            return;
        }

        const formData = new FormData();
        formData.append('photo', file);
        formData.append('email', email);

        axios.post('http://localhost:3000/api/users/update-photo', formData)
            .then(() => alert('Photo de profil mise à jour.'))
            .catch(err => console.error(err));
    };

    return (
        <div>
            <h2>Changer la Photo de Profil</h2>
            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <br /><br />
            <input
                type="file"
                accept="image/*"
                onChange={(e) => setFile(e.target.files[0])}
            />
            <br /><br />
            <button onClick={handlePhotoChange}>Modifier la Photo</button>
        </div>
    );
}
