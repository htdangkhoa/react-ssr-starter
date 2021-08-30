const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const isExist = fs.existsSync(path.resolve(process.cwd(), 'public/stats.json'));

if (!isExist) spawnSync('npm', ['run', 'build'], { shell: true, env: process.env, stdio: 'inherit' });
