const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const serverModules = path.join(__dirname, 'server', 'node_modules');
if (!fs.existsSync(path.join(serverModules, 'express'))) {
  console.log('Installing server dependencies...');
  execSync('npm install --production', { cwd: path.join(__dirname, 'server'), stdio: 'inherit' });
}

require('./server/index.js');
