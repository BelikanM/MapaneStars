import { Client, Databases, Permission, Role } from 'node-appwrite';

// ===== Configuration =====
const client = new Client()
  .setEndpoint('https://fra.cloud.appwrite.io/v1')
  .setProject('681deee80012cf6d3e15')
  .setKey('TA_CLE_API_ADMIN'); // Utilise la clé API avec les droits Admin

const databases = new Databases(client);

const DATABASE_ID = '6827862c0013da2a704c';
const COLLECTIONS = ['users', 'followers', 'comments', 'videos'];

const defaultPermissions = [
  Permission.read(Role.users()),
  Permission.create(Role.users()),
  Permission.update(Role.users()),
  Permission.delete(Role.users()),
];

async function resetPermissions() {
  for (const collectionId of COLLECTIONS) {
    try {
      // Récupère les documents de la collection
      const res = await databases.listDocuments(DATABASE_ID, collectionId);

      for (const doc of res.documents) {
        await databases.updateDocument(
          DATABASE_ID,
          collectionId,
          doc.$id,
          {}, // Pas de modification des données
          defaultPermissions
        );
        console.log(`✅ Permissions mises à jour pour le document: ${doc.$id} dans la collection: ${collectionId}`);
      }
    } catch (error) {
      console.error(`❌ Erreur sur la collection ${collectionId}:`, error.message);
    }
  }

  console.log('🎉 Réinitialisation des permissions terminée !');
}

resetPermissions();
