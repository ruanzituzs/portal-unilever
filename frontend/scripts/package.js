const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('Creating staging dir...');
const staging = path.join(__dirname, '..', 'build-staging');
if (fs.existsSync(staging)) fs.rmSync(staging, { recursive: true, force: true });
fs.mkdirSync(staging);

console.log('Copying files for packaging...');
fs.cpSync(path.join(__dirname, '..', 'dist'), path.join(staging, 'dist'), { recursive: true });
fs.copyFileSync(path.join(__dirname, '..', 'main.js'), path.join(staging, 'main.js'));
fs.copyFileSync(path.join(__dirname, '..', 'package.json'), path.join(staging, 'package.json'));

console.log('Packaging app...');
try {
    execSync('npx electron-packager ./build-staging "Unilever Learn Hub" --platform=win32 --arch=x64 --out=./release --overwrite', {
        cwd: path.join(__dirname, '..'),
        stdio: 'inherit'
    });
} catch (e) {
    console.error('Failed to package electron app:', e);
}

console.log('Cleaning up...');
if (fs.existsSync(staging)) fs.rmSync(staging, { recursive: true, force: true });
console.log('Done!');
