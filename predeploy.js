/* eslint-disable no-console */

const fs = require('fs');
const path = require('path');

const { argv, exit } = require('process');

const packagePath = './package.json';
const packageName = argv[2];

// Check if given parameter is a valid package name
const packagesDirectory = path.join(__dirname, 'packages');
if (!fs.existsSync(path.join(packagesDirectory, packageName))) {
  console.error(`Package with name "${packageName}" doesn't exist`);
  exit(1);
}

// Replace package/service name placeholder in package.json
const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf-8'));

if (packageName === 'web') {
  // During web deployment, we do the building ourselves, so we don't need the build script
  delete packageJson.scripts['gcp-build'];
} else {
  packageJson.scripts['gcp-build'] = packageJson.scripts['gcp-build'].replace(
    '$SERVICE',
    packageName,
  );
}

packageJson.scripts.start = packageJson.scripts.start.replace('$SERVICE', packageName);

fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 2));
