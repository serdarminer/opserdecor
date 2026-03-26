const { execSync } = require('child_process');
const path = require('path');

// Install server dependencies if needed
const serverDir = path.join(__dirname, 'server');
try {
  require(path.join(serverDir, 'node_modules', 'express'));
} catch {
  console.log('Installing server dependencies...');
  execSync('npm install', { cwd: serverDir, stdio: 'inherit' });
}

// Start the server
require('./server/index.js');
