import React, { useEffect, useState } from 'react';
import * as AppwriteAPI from './AppwriteAPI';
import { FaUserPlus, FaUserCheck } from 'react-icons/fa';

function Liste() {
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const user = await AppwriteAPI.getCurrentUser();
        setCurrentUser(user);
        const allUsers = await AppwriteAPI.getAllUsers(); // À implémenter dans AppwriteAPI si pas déjà
        setUsers(allUsers);
      } catch (err) {
        console.error('Erreur récupération utilisateurs:', err);
      }
    };
    fetchUsers();
  }, []);

  const handleFollow = async (targetId) => {
    if (!currentUser) {
      alert('Connectez-vous pour suivre des utilisateurs.');
      return;
    }
    const result = await AppwriteAPI.toggleFollow(currentUser.$id, targetId);
    alert(`Vous avez ${result.status === 'followed' ? 'suivi' : 'désabonné'} cet utilisateur.`);
  };

  return (
    <div style={{ textAlign: 'center' }}>
      {users.map((user) => (
        <div key={user.$id} style={{ marginBottom: '20px', backgroundColor: '#1f1f1f', padding: '10px', borderRadius: '8px' }}>
          <p>{user.name}</p>
          <button onClick={() => handleFollow(user.$id)} style={buttonStyle}>
            <FaUserPlus size={16} style={{ marginRight: '5px' }} /> Suivre
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
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

export default Liste;
