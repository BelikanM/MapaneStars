import { Client, Account, Databases, Storage, ID, Query, Permission, Role } from 'appwrite';

// ===== Configuration =====
const client = new Client()
  .setEndpoint(process.env.REACT_APP_APPWRITE_ENDPOINT)
  .setProject(process.env.REACT_APP_APPWRITE_PROJECT_ID);

export const account = new Account(client);
const databases = new Databases(client);
const storage = new Storage(client);

const DATABASE_ID = process.env.REACT_APP_APPWRITE_DATABASE_ID;
const STORAGE_ID = process.env.REACT_APP_APPWRITE_STORAGE_ID;
const COLLECTIONS = {
  users: process.env.REACT_APP_APPWRITE_COLLECTION_USERS,
  followers: process.env.REACT_APP_APPWRITE_COLLECTION_FOLLOWERS,
  comments: process.env.REACT_APP_APPWRITE_COLLECTION_COMMENTS,
  videos: process.env.REACT_APP_APPWRITE_COLLECTION_VIDEOS,
};

const defaultPermissions = [
  Permission.read(Role.users()),
  Permission.create(Role.users()),
  Permission.update(Role.users()),
  Permission.delete(Role.users()),
];

// ===== Helper : Vérification de Session =====
const ensureUserSession = async () => {
  const user = await getCurrentUser();
  if (!user) throw new Error("Vous devez être connecté pour effectuer cette action.");
  return user;
};

// ===== Session Management =====
export const getCurrentUser = async () => {
  try {
    return await account.get();
  } catch {
    return null;
  }
};

// ===== Authentification =====
export const register = (email, password, name) => 
  account.create(ID.unique(), email, password, name);

export const login = (email, password) => 
  account.createEmailSession(email, password);

export const loginWithGoogle = () => 
  account.createOAuth2Session('google', window.location.href, window.location.href);

export const logout = () => 
  account.deleteSession('current');

// ===== Vidéos =====
export const uploadVideo = async (file, caption) => {
  const user = await ensureUserSession();
  const uploadedFile = await storage.createFile(STORAGE_ID, ID.unique(), file, defaultPermissions);
  const videoUrl = storage.getFilePreview(STORAGE_ID, uploadedFile.$id);

  return databases.createDocument(
    DATABASE_ID,
    COLLECTIONS.videos,
    ID.unique(),
    {
      userId: user.$id,
      caption,
      videoUrl: videoUrl.href,
      likes: 0,
      createdAt: new Date().toISOString(),
    },
    defaultPermissions
  );
};

export const getFeed = async () => {
  const res = await databases.listDocuments(DATABASE_ID, COLLECTIONS.videos, [Query.orderDesc('createdAt')]);
  return res.documents;
};

export const likeVideo = async (documentId, currentLikes) => {
  await ensureUserSession();
  return databases.updateDocument(DATABASE_ID, COLLECTIONS.videos, documentId, { likes: currentLikes + 1 });
};

export const updateVideoCaption = async (documentId, newCaption) => {
  await ensureUserSession();
  return databases.updateDocument(DATABASE_ID, COLLECTIONS.videos, documentId, { caption: newCaption });
};

export const deleteVideo = async (documentId) => {
  await ensureUserSession();
  return databases.deleteDocument(DATABASE_ID, COLLECTIONS.videos, documentId);
};

// ===== Comments =====
export const addComment = async (videoId, content) => {
  const user = await ensureUserSession();
  return databases.createDocument(
    DATABASE_ID,
    COLLECTIONS.comments,
    ID.unique(),
    {
      videoId,
      userId: user.$id,
      content,
      createdAt: new Date().toISOString(),
    },
    defaultPermissions
  );
};

export const getComments = async (videoId) => {
  const res = await databases.listDocuments(DATABASE_ID, COLLECTIONS.comments, [
    Query.equal('videoId', videoId),
    Query.orderDesc('createdAt'),
  ]);
  return res.documents;
};

// ===== Followers =====
export const toggleFollow = async (followingId) => {
  const user = await ensureUserSession();

  const res = await databases.listDocuments(DATABASE_ID, COLLECTIONS.followers, [
    Query.equal('followerId', user.$id),
    Query.equal('followingId', followingId),
  ]);

  if (res.documents.length > 0) {
    await databases.deleteDocument(DATABASE_ID, COLLECTIONS.followers, res.documents[0].$id);
    return { status: 'unfollowed' };
  } else {
    await databases.createDocument(
      DATABASE_ID,
      COLLECTIONS.followers,
      ID.unique(),
      {
        followerId: user.$id,
        followingId,
        createdAt: new Date().toISOString(),
      },
      defaultPermissions
    );
    return { status: 'followed' };
  }
};

// ===== Users =====
export const getAllUsers = async () => {
  const res = await databases.listDocuments(DATABASE_ID, COLLECTIONS.users);
  return res.documents;
};

// ===== Profile Updates =====
export const updateUserProfile = async (data) => {
  const user = await ensureUserSession();
  return databases.updateDocument(DATABASE_ID, COLLECTIONS.users, user.$id, data);
};

export const changePassword = (newPassword) => 
  account.updatePassword(newPassword);

export const updateProfilePhoto = async (file) => {
  const user = await ensureUserSession();
  const uploadedFile = await storage.createFile(STORAGE_ID, ID.unique(), file, defaultPermissions);
  const photoUrl = storage.getFilePreview(STORAGE_ID, uploadedFile.$id);

  return updateUserProfile({ profilePic: photoUrl.href });
};
