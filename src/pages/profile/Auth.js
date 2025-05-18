import React from 'react';
import { useUser } from './UserContext';
import AppwriteAPI from './AppwriteAPI';

export default function Auth() {
  const { user, fetchUser } = useUser();

  const handleLogin = () => AppwriteAPI.loginWithGoogle();
  const handleLogout = async () => {
    await AppwriteAPI.logout();
    fetchUser();
  };

  return (
    <div className="auth-container">
      {!user ? (
        <button className="btn google" onClick={handleLogin}>Connexion Google</button>
      ) : (
        <div className="user-info">
          <img 
            src={user.prefs?.profilePicture || 'https://via.placeholder.com/150'} 
            alt="Avatar" 
            className="avatar"
          />
          <p>{user.name}</p>
          <p>{user.email}</p>
          <button className="btn logout" onClick={handleLogout}>Déconnexion</button>
        </div>
      )}
    </div>
  );
}
