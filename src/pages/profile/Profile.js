import React, { useEffect, useState } from 'react';
import { getCurrentUser, logout, loginWithGoogle } from './profile/Auth';
import './profile.css';

const Profile = () => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            const currentUser = await getCurrentUser();
            if (currentUser) {
                setUser(currentUser);
                // Rediriger vers Actualités après connexion
                window.location.href = '/Actualites';
            }
        };
        fetchUser();
    }, []);

    const handleLogin = () => {
        loginWithGoogle();
    };

    const handleLogout = () => {
        logout();
    };

    return (
        <div className="profile-container">
            {!user ? (
                <div className="login-section">
                    <h2>Bienvenue !</h2>
                    <button className="google-login-btn" onClick={handleLogin}>
                        Connexion avec Google
                    </button>
                </div>
            ) : (
                <div className="user-info">
                    <img 
                        src="https://via.placeholder.com/150" 
                        alt="Photo de profil par défaut" 
                        className="profile-photo" 
                    />
                    <h3>{user.name || user.email}</h3>
                    <p>Email : {user.email}</p>
                    <button className="logout-btn" onClick={handleLogout}>
                        Déconnexion
                    </button>
                </div>
            )}
        </div>
    );
};

export default Profile;
