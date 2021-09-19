const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const isExistStats = fs.existsSync(path.resolve(process.cwd(), 'public/stats.json'));

const isExistBuild = fs.existsSync(path.resolve(process.cwd(), 'build'));

if (!isExistStats || !isExistBuild)
  spawnSync('npm', ['run', 'build'], { shell: true, env: process.env, stdio: 'inherit' });
