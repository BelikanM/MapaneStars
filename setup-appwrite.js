const { Client, Databases, Storage, ID } = require('node-appwrite');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const config = {
  endpoint: process.env.APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1',
  projectId: process.env.APPWRITE_PROJECT_ID,
  apiKey: process.env.APPWRITE_API_KEY,
};

if (!config.projectId || !config.apiKey) {
  console.error('Erreur: APPWRITE_PROJECT_ID et APPWRITE_API_KEY sont requis dans .env');
  process.exit(1);
}

const client = new Client()
  .setEndpoint(config.endpoint)
  .setProject(config.projectId)
  .setKey(config.apiKey);

const databases = new Databases(client);
const storage = new Storage(client);

async function setupAppwrite() {
  console.log('🚀 Démarrage de la configuration Appwrite...');
  try {
    const database = await createOrReplaceDatabase();
    console.log(`✅ Base de données prête: ${database.$id}`);

    const usersCollection = await createUsersCollection(database.$id);
    const postsCollection = await createPostsCollection(database.$id);
    const followersCollection = await createFollowersCollection(database.$id);

    const bucket = await createStorageBucket();

    await generateConfigFile({
      databaseId: database.$id,
      userCollectionId: usersCollection.$id,
      postsCollectionId: postsCollection.$id,
      followersCollectionId: followersCollection.$id,
      storageId: bucket.$id,
    });

    console.log('🎉 Configuration Appwrite terminée avec succès!');
  } catch (error) {
    console.error('❌ Erreur lors de la configuration:', error);
    process.exit(1);
  }
}

async function createOrReplaceDatabase() {
  const dbList = await databases.list();
  const existingDb = dbList.databases.find(db => db.name === 'app_database');
  if (existingDb) {
    console.log(`⚠️ Une base nommée 'app_database' existe déjà (ID: ${existingDb.$id}), suppression...`);
    await databases.delete(existingDb.$id);
    console.log('🗑️ Ancienne base supprimée.');
  }
  return await databases.create(ID.unique(), 'app_database');
}

async function setCollectionPermissions(databaseId, collectionId) {
  await databases.updateCollection(databaseId, collectionId, {
    permissions: [
      'read("role:all")',
      'create("role:users")',
      'update("role:users")',
      'delete("role:users")'
    ]
  });
}

async function createUsersCollection(databaseId) {
  const collection = await databases.createCollection(databaseId, ID.unique(), 'users');
  await setCollectionPermissions(databaseId, collection.$id);

  await databases.createStringAttribute(databaseId, collection.$id, 'name', 255, true);
  await databases.createStringAttribute(databaseId, collection.$id, 'bio', 1000, false);
  await databases.createStringAttribute(databaseId, collection.$id, 'userId', 255, true);
  await databases.createStringAttribute(databaseId, collection.$id, 'email', 255, true);
  await databases.createStringAttribute(databaseId, collection.$id, 'profilePicId', 255, false);
  await databases.createIntegerAttribute(databaseId, collection.$id, 'followers', false);
  await databases.createIntegerAttribute(databaseId, collection.$id, 'following', false);
  await databases.createDatetimeAttribute(databaseId, collection.$id, 'createdAt', true);

  await databases.createIndex(databaseId, collection.$id, 'userId_index', 'key', ['userId'], { unique: true });

  return collection;
}

async function createPostsCollection(databaseId) {
  const collection = await databases.createCollection(databaseId, ID.unique(), 'posts');
  await setCollectionPermissions(databaseId, collection.$id);

  await databases.createStringAttribute(databaseId, collection.$id, 'userId', 255, true);
  await databases.createStringAttribute(databaseId, collection.$id, 'caption', 1000, false);
  await databases.createStringAttribute(databaseId, collection.$id, 'imageId', 255, false);
  await databases.createIntegerAttribute(databaseId, collection.$id, 'likes', false);
  await databases.createDatetimeAttribute(databaseId, collection.$id, 'createdAt', true);

  await databases.createIndex(databaseId, collection.$id, 'userId_index', 'key', ['userId']);
  await databases.createIndex(databaseId, collection.$id, 'createdAt_index', 'key', ['createdAt']);

  return collection;
}

async function createFollowersCollection(databaseId) {
  const collection = await databases.createCollection(databaseId, ID.unique(), 'followers');
  await setCollectionPermissions(databaseId, collection.$id);

  await databases.createStringAttribute(databaseId, collection.$id, 'followerId', 255, true);
  await databases.createStringAttribute(databaseId, collection.$id, 'followingId', 255, true);
  await databases.createDatetimeAttribute(databaseId, collection.$id, 'createdAt', true);

  await databases.createIndex(
    databaseId,
    collection.$id,
    'follower_following_index',
    'key',
    ['followerId', 'followingId'],
    { unique: true }
  );

  return collection;
}

async function createStorageBucket() {
  return await storage.createBucket(
    ID.unique(),
    'app_storage',
    {
      permissions: [
        'read("role:all")',
        'create("role:users")',
        'update("role:users")',
        'delete("role:users")'
      ],
      fileSecurity: false
    }
  );
}

async function generateConfigFile(ids) {
  const configContent = `// src/services/appwriteConfig.js
import { Client, Account, Databases, Storage, Query, ID } from 'appwrite';

export const config = {
  endpoint: '${config.endpoint}',
  projectId: '${config.projectId}',
  databaseId: '${ids.databaseId}',
  userCollectionId: '${ids.userCollectionId}',
  postsCollectionId: '${ids.postsCollectionId}',
  followersCollectionId: '${ids.followersCollectionId}',
  storageId: '${ids.storageId}',
};

const client = new Client()
  .setEndpoint(config.endpoint)
  .setProject(config.projectId);

export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);
export { ID, Query };
export default client;
`;

  const servicesDir = path.join(__dirname, 'src', 'services');
  if (!fs.existsSync(servicesDir)) {
    fs.mkdirSync(servicesDir, { recursive: true });
  }

  fs.writeFileSync(path.join(servicesDir, 'appwriteConfig.js'), configContent);
}

setupAppwrite();
