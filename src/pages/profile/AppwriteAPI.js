import { Client, Account, ID, Avatars, Databases } from 'appwrite';

const client = new Client();
client
  .setEndpoint('https://fra.cloud.appwrite.io/v1')
  .setProject('67bb24ad002378e79e38');

const account = new Account(client);
const avatars = new Avatars(client);
const databases = new Databases(client);

// Authentification
export const loginWithGoogle = () => account.createOAuth2Session('google');
export const logout = () => account.deleteSession('current');
export const getCurrentUser = () => account.get();

// Gestion du Profil
export const updatePassword = (newPassword, oldPassword) =>
  account.updatePassword(newPassword, oldPassword);

export const updateProfilePhoto = async (file) => {
  // Implémenter upload Appwrite Storage et récupérer l'URL
  // Exemple simplifié, adapte avec ton bucket si nécessaire
  return 'https://via.placeholder.com/150';
};

// Exemple pour gérer les utilisateurs
export const getAllUsers = async () => {
  try {
    // Ajoute ici la logique si tu as une base de données des utilisateurs
    return [];
  } catch (err) {
    console.error(err);
    return [];
  }
};

export default {
  loginWithGoogle,
  logout,
  getCurrentUser,
  updatePassword,
  updateProfilePhoto,
  getAllUsers,
};
