import axios from 'axios';

const BASE_URL = 'http://127.0.0.1:8090/api';
const ADMIN_EMAIL = 'nyundumathryme@gmail.com';
const ADMIN_PASSWORD = 'Dieu19961991??!??!';

let authToken = '';

async function authenticateAdmin() {
  try {
    const res = await axios.post(`${BASE_URL}/admins/auth-with-password`, {
      identity: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
    });
    authToken = res.data.token;
    console.log('✅ Admin authentifié.');
  } catch (error) {
    console.error('❌ Échec de l\'authentification Admin.', error.response?.data || error);
    process.exit(1);
  }
}

async function createCollection(name, fields) {
  try {
    await axios.post(
      `${BASE_URL}/collections`,
      {
        name,
        type: 'base',
        schema: fields,
      },
      {
        headers: { Authorization: `Bearer ${authToken}` },
      }
    );
    console.log(`✅ Collection "${name}" créée.`);
  } catch (error) {
    if (error.response?.data?.data?.name?.code === 'validation_invalid_value') {
      console.log(`ℹ️ Collection "${name}" existe déjà.`);
    } else {
      console.error(`❌ Erreur création "${name}":`, error.response?.data || error);
    }
  }
}

async function setup() {
  await authenticateAdmin();

  // 1. Collection "videos"
  await createCollection('videos', [
    {
      name: 'title',
      type: 'text',
      required: true,
      options: { min: 1, max: 100 },
    },
    {
      name: 'description',
      type: 'text',
      options: { max: 500 },
    },
    {
      name: 'video_file',
      type: 'file',
      required: true,
      options: { maxSelect: 1 },
    },
    {
      name: 'thumbnail',
      type: 'file',
      options: { maxSelect: 1 },
    },
    {
      name: 'author',
      type: 'relation',
      required: true,
      options: { collectionId: '_pb_users_auth_', maxSelect: 1 },
    },
    {
      name: 'likes',
      type: 'relation',
      options: { collectionId: '_pb_users_auth_', maxSelect: null },
    },
    {
      name: 'views',
      type: 'number',
      options: { min: 0 },
    },
    {
      name: 'created_at',
      type: 'date',
    },
  ]);

  // 2. Collection "comments"
  await createCollection('comments', [
    {
      name: 'content',
      type: 'text',
      required: true,
      options: { max: 300 },
    },
    {
      name: 'author',
      type: 'relation',
      required: true,
      options: { collectionId: '_pb_users_auth_', maxSelect: 1 },
    },
    {
      name: 'video',
      type: 'relation',
      required: true,
      options: { collectionId: 'videos', maxSelect: 1 },
    },
    {
      name: 'created_at',
      type: 'date',
    },
  ]);

  console.log('🎉 Configuration terminée avec succès.');
}

setup();
