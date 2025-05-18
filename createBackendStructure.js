const fs = require('fs');
const path = require('path');

const baseDir = path.join(__dirname, 'tiktok-backend');
const structure = {
    controllers: ['authController.js', 'userController.js', 'videoController.js'],
    routes: ['auth.js', 'users.js', 'videos.js'],
    models: ['db.js'],
    files: ['server.js', '.env']
};

function createStructure() {
    if (!fs.existsSync(baseDir)) {
        fs.mkdirSync(baseDir);
        console.log(`📁 Created: ${baseDir}`);
    }

    Object.keys(structure).forEach((folder) => {
        if (folder === 'files') {
            structure[folder].forEach((file) => {
                const filePath = path.join(baseDir, file);
                if (!fs.existsSync(filePath)) {
                    fs.writeFileSync(filePath, '');
                    console.log(`📄 Created: ${filePath}`);
                }
            });
        } else {
            const dirPath = path.join(baseDir, folder);
            if (!fs.existsSync(dirPath)) {
                fs.mkdirSync(dirPath);
                console.log(`📁 Created: ${dirPath}`);
            }
            structure[folder].forEach((file) => {
                const filePath = path.join(dirPath, file);
                if (!fs.existsSync(filePath)) {
                    fs.writeFileSync(filePath, '');
                    console.log(`📄 Created: ${filePath}`);
                }
            });
        }
    });

    console.log('✅ Structure created successfully.');
}

createStructure();
