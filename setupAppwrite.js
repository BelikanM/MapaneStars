require('dotenv').config();
const sdk = require('node-appwrite');

const client = new sdk.Client()
  .setEndpoint(process.env.APPWRITE_ENDPOINT)
  .setProject(process.env.APPWRITE_PROJECT_ID)
  .setKey(process.env.APPWRITE_API_KEY);

const databases = new sdk.Databases(client);
const storage = new sdk.Storage(client);

const defaultPermissions = [
  sdk.Permission.read(sdk.Role.users()),
  sdk.Permission.create(sdk.Role.users()),
  sdk.Permission.update(sdk.Role.users()),
  sdk.Permission.delete(sdk.Role.users()),
];

(async () => {
  try {
    // Suppression base de données si existante
    const dbList = await databases.list();
    const existingDB = dbList.databases.find(db => db.name === 'app_database');

    if (existingDB) {
      console.log(`🗑️ Suppression de la base existante : ${existingDB.$id}`);
      await databases.delete(existingDB.$id);
    }

    const db = await databases.create(sdk.ID.unique(), 'app_database');
    console.log(`✅ Base de données créée : ${db.$id}`);

    const collections = [
      {
        id: 'users',
        name: 'Users',
        attributes: [
          { method: 'createStringAttribute', key: 'name', size: 255, required: true },
          { method: 'createEmailAttribute', key: 'email', required: true },
          { method: 'createStringAttribute', key: 'bio', size: 500, required: false },
          { method: 'createUrlAttribute', key: 'profilePic', required: false },
          { method: 'createDatetimeAttribute', key: 'createdAt', required: true },
        ],
      },
      {
        id: 'videos',
        name: 'Videos',
        attributes: [
          { method: 'createStringAttribute', key: 'userId', size: 36, required: true },
          { method: 'createStringAttribute', key: 'caption', size: 500, required: false },
          { method: 'createUrlAttribute', key: 'videoUrl', required: true },
          { method: 'createIntegerAttribute', key: 'likes', required: false, default: 0 },
          { method: 'createStringAttribute', key: 'location', size: 255, required: false },
          { method: 'createDatetimeAttribute', key: 'createdAt', required: true },
        ],
      },
      {
        id: 'comments',
        name: 'Comments',
        attributes: [
          { method: 'createStringAttribute', key: 'videoId', size: 36, required: true },
          { method: 'createStringAttribute', key: 'userId', size: 36, required: true },
          { method: 'createStringAttribute', key: 'content', size: 1000, required: true },
          { method: 'createDatetimeAttribute', key: 'createdAt', required: true },
        ],
      },
      {
        id: 'followers',
        name: 'Followers',
        attributes: [
          { method: 'createStringAttribute', key: 'followerId', size: 36, required: true },
          { method: 'createStringAttribute', key: 'followingId', size: 36, required: true },
          { method: 'createDatetimeAttribute', key: 'createdAt', required: true },
        ],
      },
    ];

    for (const col of collections) {
      const collection = await databases.createCollection(db.$id, col.id, col.name, defaultPermissions);
      console.log(`✅ Collection créée : ${col.name}`);

      for (const attr of col.attributes) {
        const { method, key, size, required, default: defaultValue } = attr;

        switch (method) {
          case 'createEmailAttribute':
          case 'createUrlAttribute':
          case 'createDatetimeAttribute':
            await databases[method](db.$id, collection.$id, key, required);
            break;
          case 'createIntegerAttribute':
            await databases[method](db.$id, collection.$id, key, required, defaultValue || 0);
            break;
          case 'createStringAttribute':
            await databases[method](db.$id, collection.$id, key, size, required, defaultValue || null);
            break;
          default:
            console.log(`❌ Méthode inconnue pour ${key}`);
        }
        console.log(`  - Attribut ajouté : ${key}`);
      }
    }

    // Suppression et Création du Bucket avec Permissions
    const buckets = await storage.listBuckets();
    const existingBucket = buckets.buckets.find(b => b.name === 'app_storage');

    if (existingBucket) {
      console.log(`🗑️ Suppression du bucket existant : ${existingBucket.$id}`);
      await storage.deleteBucket(existingBucket.$id);
    }

    const bucket = await storage.createBucket(
      sdk.ID.unique(),
      'app_storage',
      defaultPermissions
    );

    console.log(`✅ Bucket de stockage créé : ${bucket.$id}`);
    console.log('🎉 Configuration complète terminée avec succès !');
  } catch (error) {
    console.error('❌ Erreur lors de la configuration :', error.message);
  }
})();
