import React, { useEffect, useState } from 'react';
import { Client, Account } from 'appwrite';
import { FcGoogle } from 'react-icons/fc';

const client = new Client()
  .setEndpoint(process.env.REACT_APP_APPWRITE_ENDPOINT)
  .setProject(process.env.REACT_APP_APPWRITE_PROJECT_ID);

const account = new Account(client);

function Auth() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const currentUser = await account.get();
        setUser(currentUser);
      } catch (err) {
        setUser(null);
      }
    };
    checkUser();
  }, []);

  const handleGoogleLogin = () => {
    account.createOAuth2Session('google', window.location.href, window.location.href);
  };

  const handleLogout = async () => {
    await account.deleteSession('current');
    setUser(null);
    window.location.reload();
  };

  return (
    <div style={{ textAlign: 'center', marginBottom: '30px' }}>
      {user ? (
        <>
          <h3>Bienvenue, {user.name}</h3>
          <button onClick={handleLogout} style={buttonStyle}>Se Déconnecter</button>
        </>
      ) : (
        <button onClick={handleGoogleLogin} style={googleButtonStyle}>
          <FcGoogle size={24} style={{ marginRight: '8px' }} /> Connexion avec Google
        </button>
      )}
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
};

const googleButtonStyle = {
  ...buttonStyle,
  backgroundColor: '#fff',
  color: '#000',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '8px',
};

export default Auth;
