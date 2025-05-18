import React, { useState } from 'react';
import axios from 'axios';

export default function Parametres() {
    const [email, setEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');

    const handleChangePassword = () => {
        axios.post('http://localhost:3000/api/users/change-password', { email, newPassword })
            .then(() => alert('Mot de passe modifié.'))
            .catch(err => console.error(err));
    };

    return (
        <div>
            <h2>Changer le Mot de Passe</h2>
            <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
            <br /><br />
            <input type="password" placeholder="Nouveau mot de passe" value={newPassword} onChange={e => setNewPassword(e.target.value)} />
            <br /><br />
            <button onClick={handleChangePassword}>Modifier</button>
        </div>
    );
}
