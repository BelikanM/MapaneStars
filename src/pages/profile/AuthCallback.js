import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AppwriteAPI from './AppwriteAPI';
import { useUser } from './UserContext';

export default function AuthCallback() {
  const navigate = useNavigate();
  const { fetchUser } = useUser();

  useEffect(() => {
    const handleAuth = async () => {
      try {
        await AppwriteAPI.getCurrentUser();
        fetchUser();
        navigate('/profile'); // Redirection après authentification
      } catch (err) {
        console.error('Erreur de callback Auth:', err);
        navigate('/');
      }
    };
    handleAuth();
  }, [navigate, fetchUser]);

  return (
    <div className="auth-container">
      <h2>Connexion en cours...</h2>
    </div>
  );
}
