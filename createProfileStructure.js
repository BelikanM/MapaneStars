const fs = require('fs');
const path = require('path');

const profileDir = path.join(__dirname, 'src', 'pages', 'profile');
const pagesDir = path.join(__dirname, 'src', 'pages');

const subComponents = [
  'AppwriteAPI.js',
  'Liste.js',
  'Upload.js',
  'Update.js',
  'Parametres.js'
];

const subComponentsContent = {
  'AppwriteAPI.js': `
import React from 'react';

function AppwriteAPI() {
  return (
    <div>
      <h2>API Appwrite</h2>
      <p>Connexion et opérations CRUD seront gérées ici.</p>
    </div>
  );
}

export default AppwriteAPI;
`.trim(),

  'Liste.js': `
import React from 'react';

function Liste() {
  return (
    <div>
      <h2>Liste des Utilisateurs</h2>
      <p>Afficher la liste des utilisateurs pour s’abonner et suivre.</p>
    </div>
  );
}

export default Liste;
`.trim(),

  'Upload.js': `
import React from 'react';

function Upload() {
  return (
    <div>
      <h2>Téléversement de Contenu</h2>
      <p>Ici, l’utilisateur pourra téléverser son contenu.</p>
    </div>
  );
}

export default Upload;
`.trim(),

  'Update.js': `
import React from 'react';

function Update() {
  return (
    <div>
      <h2>Modification des Informations</h2>
      <p>Permet de modifier les données du profil.</p>
    </div>
  );
}

export default Update;
`.trim(),

  'Parametres.js': `
import React from 'react';

function Parametres() {
  return (
    <div>
      <h2>Paramètres du Compte</h2>
      <p>Modifier le mot de passe et la photo de profil.</p>
    </div>
  );
}

export default Parametres;
`.trim()
};

// Création du dossier profile/
if (!fs.existsSync(profileDir)) {
  fs.mkdirSync(profileDir, { recursive: true });
  console.log('✅ Dossier "profile" créé sous src/pages/.');
} else {
  console.log('ℹ️ Dossier "profile" existe déjà.');
}

// Création des sous-composants
subComponents.forEach(file => {
  const filePath = path.join(profileDir, file);
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, subComponentsContent[file]);
    console.log(`✅ Fichier ${file} créé.`);
  } else {
    console.log(`ℹ️ Fichier ${file} existe déjà.`);
  }
});

// Création de Profile.js dans pages/
const profilePagePath = path.join(pagesDir, 'Profile.js');
if (!fs.existsSync(profilePagePath)) {
  const profilePageContent = `
import React from 'react';
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
`.trim();

  fs.writeFileSync(profilePagePath, profilePageContent);
  console.log('✅ Fichier "Profile.js" créé dans src/pages/.');
} else {
  console.log('ℹ️ Fichier "Profile.js" existe déjà.');
}

console.log('🎉 Génération complète terminée avec succès !');
