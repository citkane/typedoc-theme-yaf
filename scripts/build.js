const fs = require('fs-extra');
const path = require('path');
const rootDir = path.join(__dirname, '..');

const assetSrcPath = 'src/frontend/assets';
const assetsTargetPath = 'dist/src/frontend/assets';

const makeAllOsPath = (linuxPath) => {
	const pathArray = [rootDir, ...linuxPath.split('/')];
	return path.join(...pathArray);
};
const copySync = (src, dest) =>
	fs.copySync(makeAllOsPath(src), makeAllOsPath(dest));

fs.readdirSync(makeAllOsPath(assetSrcPath)).forEach((fileName) => {
	if (fileName !== 'scss' && !fileName.endsWith('.md')) {
		copySync(
			`${assetSrcPath}/${fileName}`,
			`${assetsTargetPath}/${fileName}`
		);
	}
});

copySync('LICENSE', 'dist/LICENSE');
copySync('package.json', 'dist/package.json');
copySync('README.md', 'dist/README.md');
