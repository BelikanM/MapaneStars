import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function Liste() {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:3000/api/users')
            .then(response => setUsers(response.data))
            .catch(error => console.error(error));
    }, []);

    return (
        <div>
            <h2>Liste des Utilisateurs</h2>
            <ul>
                {users.map(user => (
                    <li key={user.id}>
                        {user.username} - {user.email}
                    </li>
                ))}
            </ul>
        </div>
    );
}
