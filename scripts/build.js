const fs = require('fs-extra');
const path = require('path');
const rootDir = path.join(__dirname, '..');

const mediaSrcPath = 'src/media';
const mediaTargetPath = 'dist/src/media';

const makeAllOsPath = (linuxPath) => {
	const pathArray = [rootDir, ...linuxPath.split('/')];
	return path.join(...pathArray);
};
const copySync = (src, dest) =>
	fs.copySync(makeAllOsPath(src), makeAllOsPath(dest));

fs.readdirSync(makeAllOsPath(mediaSrcPath)).forEach((fileName) => {
	if (fileName !== 'scss' && !fileName.endsWith('.md')) {
		copySync(
			`${mediaSrcPath}/${fileName}`,
			`${mediaTargetPath}/${fileName}`
		);
	}
});

['src/index.html', 'LICENSE', 'README.md', '.npmignore'].forEach((file) => {
	copySync(file, `dist/${file}`);
});

const package = fs.readJSONSync('package.json');
['devDependencies', 'mocha', 'workspaces', 'nyc', 'scripts'].forEach((prop) => {
	delete package[prop];
});
fs.writeJSONSync('dist/package.json', package, { spaces: '\t' });
