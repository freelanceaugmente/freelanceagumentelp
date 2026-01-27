const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Helper to copy directory recursively
function copyDir(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      // Skip these folders
      if (['node_modules', '.git', '.next', '_site', 'applistgenerator', '.netlify'].includes(entry.name)) continue;
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

console.log('🚀 Building Freelance Augmenté...');

const applistDir = path.join(__dirname, 'applistgenerator');
const publicDir = path.join(applistDir, 'public');

// Ensure public folder exists
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Step 1: Copy landing page static files to applistgenerator/public
console.log('📄 Copying landing page files to Next.js public folder...');
const filesToCopy = ['index.html', 'logo-navbar.svg', 'media1.svg'];
const dirsToCopy = ['assets', 'avatar', 'avis', 'domaines'];

filesToCopy.forEach(file => {
  const src = path.join(__dirname, file);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, path.join(publicDir, file));
    console.log(`  ✓ Copied ${file}`);
  }
});

dirsToCopy.forEach(dir => {
  const src = path.join(__dirname, dir);
  if (fs.existsSync(src)) {
    copyDir(src, path.join(publicDir, dir));
    console.log(`  ✓ Copied ${dir}/`);
  }
});

// Step 2: Install dependencies and build Next.js app
console.log('⚙️ Installing dependencies...');
execSync('npm install', { cwd: applistDir, stdio: 'inherit' });

console.log('⚙️ Building Next.js app...');
execSync('npm run build', { cwd: applistDir, stdio: 'inherit' });

console.log('✅ Build complete!');
