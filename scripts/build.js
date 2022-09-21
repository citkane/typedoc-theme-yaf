const fs = require('fs-extra');
const path = require('path');

fs.copySync('src/assets/fonts', 'dist/src/assets/fonts');
fs.copyFileSync('src/assets/logo.svg', 'dist/src/assets/logo.svg');
fs.readdirSync('src/webComponents/components').forEach((fileName) => {
	const ext = path.extname(fileName);
	if (ext === '.html' || ext === '.css') {
		fs.copyFileSync(
			path.join('src/webComponents/components', fileName),
			path.join('dist/src/webComponents/components', fileName)
		);
	}
});
//fs.copyFileSync('src/webComponents/components/*.css', 'dist/src/webComponents/components/');
//fs.copyFileSync('src/webComponents/components/*.html', 'dist/src/webComponents/components/');
fs.copyFileSync('LICENSE', 'dist/LICENSE');
fs.copyFileSync('package.json', 'dist/package.json');
//fs.copyFileSync('.npmignore', 'dist/.npmignore');
fs.copyFileSync('README.md', 'dist/README.md');
/*
#! /bin/bash

./node_modules/.bin/tsc --build;
npm run build:css;
rsync -a ./src/assets/ ./dist/src/assets/ --exclude 'scss' --exclude 'ts' --exclude '*.md';
cp ./src/webComponents/components/*.css ./dist/src/webComponents/components/;
cp ./src/webComponents/components/*.html ./dist/src/webComponents/components/;
cp ./LICENSE ./dist/LICENSE;
cp ./package.json ./dist/package.json;
cp ./.npmignore ./dist/.npmignore;
cp ./README.md ./dist/README.md;

*/
