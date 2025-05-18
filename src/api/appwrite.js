// api/appwrite.js

import { Client, Account, Databases, Storage, ID, Query, Permission, Role } from 'appwrite';

// ===== Configuration =====
const client = new Client()
  .setEndpoint(process.env.REACT_APP_APPWRITE_ENDPOINT || 'https://fra.cloud.appwrite.io/v1')
  .setProject(process.env.REACT_APP_APPWRITE_PROJECT_ID || '67bb24ad002378e79e38');

export const account = new Account(client);
const databases = new Databases(client);
const storage = new Storage(client);

// IDs des ressources Appwrite
const DATABASE_ID = process.env.REACT_APP_APPWRITE_DATABASE_ID || 'your-database-id';
const STORAGE_BUCKET_ID = process.env.REACT_APP_APPWRITE_STORAGE_ID || 'your-storage-id';
const COLLECTIONS = {
  users: process.env.REACT_APP_APPWRITE_COLLECTION_USERS || 'users-collection-id',
  followers: process.env.REACT_APP_APPWRITE_COLLECTION_FOLLOWERS || 'followers-collection-id',
  comments: process.env.REACT_APP_APPWRITE_COLLECTION_COMMENTS || 'comments-collection-id',
  videos: process.env.REACT_APP_APPWRITE_COLLECTION_VIDEOS || 'posts-collection-id',
};

const defaultPermissions = [
  Permission.read(Role.users()),
  Permission.create(Role.users()),
  Permission.update(Role.users()),
  Permission.delete(Role.users()),
];

// ===== Gestion de session améliorée =====

// Stockage local pour l'état de la session
let currentUser = null;
let sessionPromise = null;
let sessionExpiry = null;
const SESSION_REFRESH_INTERVAL = 14 * 60 * 1000; // 14 minutes (juste avant l'expiration de 15 min d'Appwrite)

// Fonction pour récupérer l'utilisateur avec mise en cache
export const getCurrentUser = async (forceRefresh = false) => {
  // Si un utilisateur est déjà en cache et qu'on ne force pas le rafraîchissement
  if (currentUser && !forceRefresh && sessionExpiry && Date.now() < sessionExpiry) {
    return currentUser;
  }

  // Si une promesse de récupération est déjà en cours, attendre son résultat
  if (sessionPromise) {
    try {
      return await sessionPromise;
    } catch (error) {
      console.error("Erreur lors de la récupération de la session en cours:", error);
    }
  }

  // Sinon, créer une nouvelle promesse pour récupérer l'utilisateur
  sessionPromise = new Promise(async (resolve, reject) => {
    try {
      const user = await account.get();
      currentUser = user;
      sessionExpiry = Date.now() + SESSION_REFRESH_INTERVAL;
      resolve(user);
    } catch (error) {
      currentUser = null;
      sessionExpiry = null;
      reject(error);
    } finally {
      sessionPromise = null;
    }
  });

  try {
    return await sessionPromise;
  } catch (error) {
    console.error("Erreur lors de la récupération de l'utilisateur:", error);
    return null;
  }
};

// Fonction pour synchroniser l'utilisateur dans la collection users
const syncUserToDatabase = async (user) => {
  if (!user) return;

  try {
    // Vérifier si l'utilisateur existe déjà dans la collection
    try {
      await databases.getDocument(DATABASE_ID, COLLECTIONS.users, user.$id);
      
      // Si l'utilisateur existe, mettre à jour ses informations
      await databases.updateDocument(
        DATABASE_ID,
        COLLECTIONS.users,
        user.$id,
        {
          name: user.name,
          email: user.email,
          lastLogin: new Date().toISOString(),
          // Autres champs à synchroniser...
        }
      );
    } catch (error) {
      // Si l'utilisateur n'existe pas, le créer
      if (error.code === 404) {
        await databases.createDocument(
          DATABASE_ID,
          COLLECTIONS.users,
          user.$id, // Utiliser l'ID Appwrite comme ID du document
          {
            name: user.name,
            email: user.email,
            createdAt: new Date().toISOString(),
            lastLogin: new Date().toISOString(),
            bio: '',
            location: '',
            // Autres champs par défaut...
          },
          defaultPermissions
        );
      } else {
        throw error;
      }
    }
  } catch (error) {
    console.error("Erreur lors de la synchronisation de l'utilisateur avec la base de données:", error);
  }
};

// Fonction pour vérifier et rafraîchir la session périodiquement
const setupSessionRefresh = () => {
  // Nettoyer tout intervalle existant
  if (window.sessionRefreshInterval) {
    clearInterval(window.sessionRefreshInterval);
  }

  // Configurer un nouvel intervalle
  window.sessionRefreshInterval = setInterval(async () => {
    try {
      const user = await getCurrentUser(true); // Forcer le rafraîchissement
      if (user) {
        console.log("Session rafraîchie automatiquement");
      }
    } catch (error) {
      console.error("Erreur lors du rafraîchissement automatique de la session:", error);
    }
  }, SESSION_REFRESH_INTERVAL);
};

// Fonction pour nettoyer les ressources de session
const cleanupSession = () => {
  if (window.sessionRefreshInterval) {
    clearInterval(window.sessionRefreshInterval);
    window.sessionRefreshInterval = null;
  }
  currentUser = null;
  sessionExpiry = null;
};

// Helper : Vérification de Session avec gestion automatique
const ensureUserSession = async () => {
  const user = await getCurrentUser();
  if (!user) throw new Error("Vous devez être connecté pour effectuer cette action.");
  return user;
};

// ===== Authentification =====
export const register = async (email, password, name) => {
  try {
    const user = await account.create(ID.unique(), email, password, name);
    
    // Créer une session après l'inscription
    await account.createEmailSession(email, password);
    
    // Récupérer l'utilisateur complet avec la session
    const loggedInUser = await getCurrentUser(true);
    
    // Synchroniser l'utilisateur avec la base de données
    await syncUserToDatabase(loggedInUser);
    
    // Configurer le rafraîchissement de session
    setupSessionRefresh();
    
    return loggedInUser;
  } catch (error) {
    console.error("Erreur lors de l'inscription:", error);
    throw error;
  }
};

export const login = async (email, password) => {
  try {
    await account.createEmailSession(email, password);
    
    // Récupérer l'utilisateur après la connexion
    const user = await getCurrentUser(true);
    
    // Mettre à jour la date de dernière connexion
    await syncUserToDatabase(user);
    
    // Configurer le rafraîchissement de session
    setupSessionRefresh();
    
    return user;
  } catch (error) {
    console.error("Erreur lors de la connexion:", error);
    throw error;
  }
};

export const loginWithGoogle = async () => {
  try {
    // Rediriger vers Google pour l'authentification
    await account.createOAuth2Session(
      'google',
      window.location.origin + '/auth-callback', // Page de redirection après authentification
      window.location.origin + '/login?error=oauth_cancelled' // Page en cas d'échec
    );
    
    // Cette fonction ne retourne pas car elle redirige le navigateur
  } catch (error) {
    console.error("Erreur lors de la connexion avec Google:", error);
    throw error;
  }
};

// Fonction pour compléter l'authentification OAuth après redirection
export const completeOAuthLogin = async () => {
  try {
    // Récupérer l'utilisateur après la redirection OAuth
    const user = await getCurrentUser(true);
    
    if (user) {
      // Synchroniser l'utilisateur avec la base de données
      await syncUserToDatabase(user);
      
      // Configurer le rafraîchissement de session
      setupSessionRefresh();
    }
    
    return user;
  } catch (error) {
    console.error("Erreur lors de la finalisation de l'authentification OAuth:", error);
    throw error;
  }
};

export const logout = async () => {
  try {
    await account.deleteSession('current');
    cleanupSession();
  } catch (error) {
    console.error("Erreur lors de la déconnexion:", error);
    throw error;
  }
};

// Vérifier la session au chargement initial
export const initializeAuth = async () => {
  try {
    const user = await getCurrentUser(true);
    
    if (user) {
      // Configurer le rafraîchissement de session
      setupSessionRefresh();
      return user;
    }
    
    return null;
  } catch (error) {
    console.error("Erreur lors de l'initialisation de l'authentification:", error);
    return null;
  }
};

// ===== Gestion du profil utilisateur =====
export const updateUserProfile = async (data) => {
  const user = await ensureUserSession();
  
  try {
    // Mettre à jour le nom si fourni
    if (data.name && data.name !== user.name) {
      await account.updateName(data.name);
    }
    
    // Mettre à jour les préférences si fournies
    if (data.prefs) {
      await account.updatePrefs({
        ...user.prefs,
        ...data.prefs
      });
    }
    
    // Synchroniser les changements avec la base de données
    const updatedUser = await getCurrentUser(true);
    await syncUserToDatabase(updatedUser);
    
    return updatedUser;
  } catch (error) {
    console.error("Erreur lors de la mise à jour du profil:", error);
    throw error;
  }
};

export const changePassword = async (newPassword, oldPassword = null) => {
  await ensureUserSession();
  
  try {
    if (oldPassword) {
      // Si l'ancien mot de passe est fourni, l'utiliser
      await account.updatePassword(newPassword, oldPassword);
    } else {
      // Sinon, utiliser la méthode sans ancien mot de passe
      await account.updatePassword(newPassword);
    }
    
    // Rafraîchir la session après changement de mot de passe
    return await getCurrentUser(true);
  } catch (error) {
    console.error("Erreur lors du changement de mot de passe:", error);
    throw error;
  }
};

export const updateProfilePhoto = async (file) => {
  const user = await ensureUserSession();
  
  try {
    // Téléverser la nouvelle image
    const uploadedFile = await storage.createFile(
      STORAGE_BUCKET_ID,
      ID.unique(),
      file,
      defaultPermissions
    );
    
    // Obtenir l'URL de l'image téléversée
    const fileUrl = storage.getFileView(STORAGE_BUCKET_ID, uploadedFile.$id);
    
    // Mettre à jour les préférences utilisateur avec la nouvelle URL
    await account.updatePrefs({
      ...user.prefs,
      profilePic: fileUrl
    });
    
    // Synchroniser avec la base de données
    const updatedUser = await getCurrentUser(true);
    await databases.updateDocument(
      DATABASE_ID,
      COLLECTIONS.users,
      user.$id,
      { profilePic: fileUrl.toString() }
    );
    
    return fileUrl;
  } catch (error) {
    console.error("Erreur lors du téléversement de la photo de profil:", error);
    throw error;
  }
};

// ===== Publications =====
export const uploadVideo = async (file, caption) => {
  const user = await ensureUserSession();
  
  try {
    // Téléverser le fichier vidéo
    const uploadedFile = await storage.createFile(
      STORAGE_BUCKET_ID,
      ID.unique(),
      file,
      defaultPermissions
    );
    
    // Obtenir l'URL de la vidéo téléversée
    const videoUrl = storage.getFileView(STORAGE_BUCKET_ID, uploadedFile.$id);
    
    // Créer un document pour la vidéo
    return databases.createDocument(
      DATABASE_ID,
      COLLECTIONS.videos,
      ID.unique(),
      {
        userId: user.$id,
        userName: user.name,
        userEmail: user.email,
        userProfilePic: user.prefs?.profilePic || null,
        caption,
        videoUrl: videoUrl.toString(),
        likes: 0,
        createdAt: new Date().toISOString(),
      },
      defaultPermissions
    );
  } catch (error) {
    console.error("Erreur lors du téléversement de la vidéo:", error);
    throw error;
  }
};

export const getFeed = async () => {
  try {
    const response = await databases.listDocuments(
      DATABASE_ID,
      COLLECTIONS.videos,
      [Query.orderDesc('createdAt')]
    );
    return response.documents;
  } catch (error) {
    console.error("Erreur lors de la récupération du feed:", error);
    throw error;
  }
};

export const getUserPosts = async (userId) => {
  try {
    const response = await databases.listDocuments(
      DATABASE_ID,
      COLLECTIONS.videos,
      [
        Query.equal('userId', userId),
        Query.orderDesc('createdAt')
      ]
    );
    return response.documents;
  } catch (error) {
    console.error("Erreur lors de la récupération des publications de l'utilisateur:", error);
    throw error;
  }
};

export const likeVideo = async (documentId, currentLikes) => {
  await ensureUserSession();
  
  try {
    return databases.updateDocument(
      DATABASE_ID,
      COLLECTIONS.videos,
      documentId,
      { likes: currentLikes + 1 }
    );
  } catch (error) {
    console.error("Erreur lors du like de la vidéo:", error);
    throw error;
  }
};

export const updateVideoCaption = async (documentId, newCaption) => {
  await ensureUserSession();
  
  try {
    return databases.updateDocument(
      DATABASE_ID,
      COLLECTIONS.videos,
      documentId,
      { caption: newCaption }
    );
  } catch (error) {
    console.error("Erreur lors de la mise à jour de la légende:", error);
    throw error;
  }
};

export const deleteVideo = async (documentId) => {
  const user = await ensureUserSession();
  
  try {
    // Vérifier si l'utilisateur est propriétaire de la vidéo
    const video = await databases.getDocument(
      DATABASE_ID,
      COLLECTIONS.videos,
      documentId
    );
    
    if (video.userId !== user.$id) {
      throw new Error("Vous n'êtes pas autorisé à supprimer cette publication");
    }
    
    // Supprimer le document
    return databases.deleteDocument(
      DATABASE_ID,
      COLLECTIONS.videos,
      documentId
    );
  } catch (error) {
    console.error("Erreur lors de la suppression de la vidéo:", error);
    throw error;
  }
};

// ===== Comments =====
export const addComment = async (videoId, content) => {
  const user = await ensureUserSession();
  
  try {
    return databases.createDocument(
      DATABASE_ID,
      COLLECTIONS.comments,
      ID.unique(),
      {
        videoId,
        userId: user.$id,
        userName: user.name,
        userEmail: user.email,
        userProfilePic: user.prefs?.profilePic || null,
        content,
        createdAt: new Date().toISOString(),
      },
      defaultPermissions
    );
  } catch (error) {
    console.error("Erreur lors de l'ajout du commentaire:", error);
    throw error;
  }
};

export const getComments = async (videoId) => {
  try {
    const response = await databases.listDocuments(
      DATABASE_ID,
      COLLECTIONS.comments,
      [
        Query.equal('videoId', videoId),
        Query.orderDesc('createdAt'),
      ]
    );
    return response.documents;
  } catch (error) {
    console.error("Erreur lors de la récupération des commentaires:", error);
    throw error;
  }
};

// ===== Followers =====
export const toggleFollow = async (followingId) => {
  const user = await ensureUserSession();
  
  try {
    // Vérifier si l'utilisateur suit déjà cette personne
    const response = await databases.listDocuments(
      DATABASE_ID,
      COLLECTIONS.followers,
      [
        Query.equal('followerId', user.$id),
        Query.equal('followingId', followingId),
      ]
    );
    
    if (response.documents.length > 0) {
      // L'utilisateur suit déjà cette personne, donc arrêter de suivre
      await databases.deleteDocument(
        DATABASE_ID,
        COLLECTIONS.followers,
        response.documents[0].$id
      );
      return { status: 'unfollowed' };
    } else {
      // L'utilisateur ne suit pas cette personne, donc commencer à suivre
      await databases.createDocument(
        DATABASE_ID,
        COLLECTIONS.followers,
        ID.unique(),
        {
          followerId: user.$id,
          followerName: user.name,
          followerEmail: user.email,
          followerProfilePic: user.prefs?.profilePic || null,
          followingId,
          createdAt: new Date().toISOString(),
        },
        defaultPermissions
      );
      return { status: 'followed' };
    }
  } catch (error) {
    console.error("Erreur lors de la modification du statut de suivi:", error);
    throw error;
  }
};

export const getFollowers = async (userId) => {
  try {
    const response = await databases.listDocuments(
      DATABASE_ID,
      COLLECTIONS.followers,
      [Query.equal('followingId', userId)]
    );
    return response.documents;
  } catch (error) {
    console.error("Erreur lors de la récupération des abonnés:", error);
    throw error;
  }
};

export const getFollowing = async (userId) => {
  try {
    const response = await databases.listDocuments(
      DATABASE_ID,
      COLLECTIONS.followers,
      [Query.equal('followerId', userId)]
    );
    return response.documents;
  } catch (error) {
    console.error("Erreur lors de la récupération des abonnements:", error);
    throw error;
  }
};

// ===== Users =====
export const getAllUsers = async () => {
  try {
    const response = await databases.listDocuments(
      DATABASE_ID,
      COLLECTIONS.users
    );
    return response.documents;
  } catch (error) {
    console.error("Erreur lors de la récupération des utilisateurs:", error);
    throw error;
  }
};

export const getUserProfile = async (userId) => {
  try {
    return databases.getDocument(
      DATABASE_ID,
      COLLECTIONS.users,
      userId
    );
  } catch (error) {
    console.error("Erreur lors de la récupération du profil utilisateur:", error);
    throw error;
  }
};

// ===== Suppression de compte =====
export const deleteAccount = async (password) => {
  const user = await ensureUserSession();
  
  try {
    // Vérifier le mot de passe si fourni
    if (password) {
      // Créer une nouvelle session pour vérifier le mot de passe
      try {
        await account.createEmailSession(user.email, password);
      } catch (error) {
        throw new Error("Mot de passe incorrect");
      }
    }
    
    // Supprimer les données associées à l'utilisateur
    try {
      // Supprimer les publications
      const userPosts = await getUserPosts(user.$id);
      for (const post of userPosts) {
        await databases.deleteDocument(DATABASE_ID, COLLECTIONS.videos, post.$id);
      }
      
      // Supprimer les relations de followers
      const followingRelations = await getFollowing(user.$id);
      for (const relation of followingRelations) {
        await databases.deleteDocument(DATABASE_ID, COLLECTIONS.followers, relation.$id);
      }
      
      const followerRelations = await getFollowers(user.$id);
      for (const relation of followerRelations) {
        await databases.deleteDocument(DATABASE_ID, COLLECTIONS.followers, relation.$id);
      }
      
      // Supprimer le profil utilisateur
      await databases.deleteDocument(DATABASE_ID, COLLECTIONS.users, user.$id);
    } catch (error) {
      console.error("Erreur lors de la suppression des données utilisateur:", error);
      // Continuer avec la suppression du compte même si la suppression des données échoue
    }
    
    // Nettoyer les ressources de session
    cleanupSession();
    
    // Supprimer la session en cours
    await account.deleteSession('current');
    
    // Supprimer le compte
    return account.delete();
  } catch (error) {
    console.error("Erreur lors de la suppression du compte:", error);
    throw error;
  }
};

// ===== Recherche =====
export const searchUsers = async (query) => {
  try {
    const response = await databases.listDocuments(
      DATABASE_ID,
      COLLECTIONS.users,
      [Query.search('name', query)]
    );
    return response.documents;
  } catch (error) {
    console.error("Erreur lors de la recherche des utilisateurs:", error);
    throw error;
  }
};

export const searchVideos = async (query) => {
  try {
    const response = await databases.listDocuments(
      DATABASE_ID,
      COLLECTIONS.videos,
      [Query.search('caption', query)]
    );
    return response.documents;
  } catch (error) {
    console.error("Erreur lors de la recherche des vidéos:", error);
    throw error;
  }
};

// Exporter toutes les fonctions
export default {
  getCurrentUser,
  register,
  login,
  loginWithGoogle,
  completeOAuthLogin,
  logout,
  initializeAuth,
  updateUserProfile,
  changePassword,
  updateProfilePhoto,
  uploadVideo,
  getFeed,
  getUserPosts,
  likeVideo,
  updateVideoCaption,
  deleteVideo,
  addComment,
  getComments,
  toggleFollow,
  getFollowers,
  getFollowing,
  getAllUsers,
  getUserProfile,
  deleteAccount,
  searchUsers,
  searchVideos
};

