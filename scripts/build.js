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

copySync('src/index.html', 'dist/src/index.html');
copySync('LICENSE', 'dist/LICENSE');
copySync('package.json', 'dist/package.json');
copySync('README.md', 'dist/README.md');
