#! /usr/bin/env node

const chokidar = require('chokidar');
const fs = require('fs-extra');
const path = require('path');

const rootPath = path.join(__dirname, '../');
const sourceCss = path.join(rootPath, './src/webComponents/templates/*.css');
const sourceHtml = path.join(rootPath, './src/webComponents/templates/*.html');
const target = path.join(rootPath, './dist/src/webComponents/templates');

console.log(`[watchComponent] ${sourceCss}`);
console.log(`[watchComponent] ${sourceHtml}`);

const watcher = chokidar.watch([sourceCss, sourceHtml], {
	ignoreInitial: true,
});

watcher
	.on('add', (path) => copyFile(path))
	.on('change', (path) => copyFile(path));

function copyFile(filePath) {
	const fileName = path.basename(filePath);
	fs.copySync(filePath, path.join(target, fileName));
	console.log(`copied ${fileName} to ${target}`);
}
