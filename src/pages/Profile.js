import React, { useState, useEffect } from 'react';
import { GoogleLogin, googleLogout } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import '../profile/profile.css';
import AuthComponent from './profile/AuthComponent';
import Liste from './profile/Liste';
import Upload from './profile/Upload';
import Parametres from './profile/Parametres';
import Update from './profile/Update';
import Navigation from './profile/Navigation';

export default function Profile() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const savedUser = localStorage.getItem('user');
        if (savedUser) setUser(JSON.parse(savedUser));
    }, []);

    const handleLoginSuccess = (credentialResponse) => {
        const decoded = jwtDecode(credentialResponse.credential);
        const userData = {
            name: decoded.name,
            email: decoded.email,
            picture: decoded.picture,
            google_uid: decoded.sub
        };
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));

        axios.post('http://localhost:3000/api/auth/google-auth', userData)
            .catch(err => console.error(err));
    };

    const handleLogout = () => {
        googleLogout();
        localStorage.removeItem('user');
        setUser(null);
    };

    return (
        <div className="profile-container">
            {!user ? (
                <GoogleLogin
                    onSuccess={handleLoginSuccess}
                    onError={() => alert('Erreur de connexion Google.')}
                />
            ) : (
                <>
                    <h2>Bienvenue, {user.name}</h2>
                    <img src={user.picture} alt="Profile" className="profile-picture" />
                    <button className="logout-btn" onClick={handleLogout}>Déconnexion</button>
                    <Navigation />
                </>
            )}
        </div>
    );
}
