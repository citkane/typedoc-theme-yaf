const fs = require('fs-extra');
const path = require('path');
const rootDir = path.join(__dirname, '..');

const mediaSrcPath = makeAllOsPath('src/media');
const mediaTargetPath = makeAllOsPath('dist/src/media');
const modulePath = makeAllOsPath('node_modules/typedoc-theme-yaf');

fs.readdirSync(mediaSrcPath).forEach((fileName) => {
	if (fileName !== 'scss' && !fileName.endsWith('.md')) {
		fs.copySync(
			path.join(mediaSrcPath, fileName),
			path.join(mediaTargetPath, fileName)
		);
	}
});

['src/index.html', 'LICENSE', 'README.md', '.npmignore'].forEach((file) => {
	fs.copySync(file, path.join('dist', file));
});

const package = fs.readJSONSync('package.json');
['devDependencies', 'mocha', 'workspaces', 'nyc', 'scripts'].forEach((prop) => {
	delete package[prop];
});
fs.writeJSONSync('dist/package.json', package, { spaces: '\t' });
fs.createSymlinkSync('./dist', modulePath);

function makeAllOsPath(linuxPath) {
	const pathArray = [rootDir, ...linuxPath.split('/')];

	return path.join(...pathArray);
}

/*
function copySync(src, dest) {
	fs.copySync(makeAllOsPath(src), makeAllOsPath(dest));
}
*/
