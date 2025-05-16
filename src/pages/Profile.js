import React from 'react';
import './profile.css'; // Assure-toi que le chemin est correct
import AppwriteAPI from './profile/AppwriteAPI';
import Liste from './profile/Liste';
import Upload from './profile/Upload';
import Update from './profile/Update';
import Parametres from './profile/Parametres';

function Profile() {
  return (
    <div>
      <h1>Mon Profil</h1>
      <AppwriteAPI />
      <Liste />
      <Upload />
      <Update />
      <Parametres />
    </div>
  );
}

export default Profile;
