const fs = require('fs-extra');
const path = require('path');
const rootDir = path.join(__dirname, '..');

const makeAllOsPath = (linuxPath) => {
	console.log(linuxPath);
	const pathArray = [rootDir, ...linuxPath.split('/')];
	console.log(path.join(...pathArray));
	return path.join(...pathArray);
};
const copySync = (src, dest) =>
	fs.copySync(makeAllOsPath(src), makeAllOsPath(dest));

copySync('src/assets/fonts', 'dist/src/assets/fonts');
copySync('src/assets/logo.svg', 'dist/src/assets/logo.svg');

fs.readdirSync(makeAllOsPath('src/assets')).forEach((fileName) => {
	if (fileName !== 'scss' && !fileName.endsWith('.md')) {
		copySync(`src/assets/${fileName}`, `dist/src/assets/${fileName}`);
	}
});

copySync('src/frontend/templates', 'dist/src/frontend/templates');
copySync('LICENSE', 'dist/LICENSE');
copySync('package.json', 'dist/package.json');
copySync('README.md', 'dist/README.md');
