import React, { useState } from 'react';
import AuthComponent from './AuthComponent';
import Liste from './Liste';
import Upload from './Upload';
import Parametres from './Parametres';
import Update from './Update';
import { FaUser, FaList, FaUpload, FaCog, FaEdit } from 'react-icons/fa';

export default function Navigation() {
    const [activeSection, setActiveSection] = useState('auth');

    const renderSection = () => {
        switch (activeSection) {
            case 'auth': return <AuthComponent />;
            case 'liste': return <Liste />;
            case 'upload': return <Upload />;
            case 'parametres': return <Parametres />;
            case 'update': return <Update />;
            default: return <AuthComponent />;
        }
    };

    return (
        <>
            <nav className="profile-nav">
                <FaUser onClick={() => setActiveSection('auth')} title="Connexion" />
                <FaList onClick={() => setActiveSection('liste')} title="Liste" />
                <FaUpload onClick={() => setActiveSection('upload')} title="Upload" />
                <FaCog onClick={() => setActiveSection('parametres')} title="Paramètres" />
                <FaEdit onClick={() => setActiveSection('update')} title="Modifier" />
            </nav>
            <div className="profile-content">
                {renderSection()}
            </div>
        </>
    );
}
