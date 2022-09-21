import path from 'path';
import { mapDirStructure } from './utils';

export const rootDir = path.join(__dirname, '../../../../');

export const rootDirTest = path.join(rootDir, 'test');
export const srcDirTest = path.join(rootDir, 'test', 'src');
export const srcDirBackend = path.join(rootDir, 'test', 'src', 'backend');
export const stubDirTest = path.join(
	rootDir,
	'test',
	'src',
	'backend',
	'stubs'
);
export const tmpDirTest = path.join(rootDir, 'test', 'tmp');
export const tmpDirTestDocs = path.join(rootDir, 'test', 'docs');

export const expectedThemeAssets = {
	assets: mapDirStructure(path.join(rootDir, 'dist/src/assets')),
	files: ['index.html'],
	frontend: mapDirStructure(path.join(rootDir, 'dist/src/frontend')),
};

export const menuBranchKeys = ['name', 'query', 'hash', 'children'];
export const highlighttest = {
	input: 'function test():void {return null}',
	output: '<span class="pl-k">function</span> <span class="pl-en">test</span>()<span class="pl-k">:</span><span class="pl-c1">void</span> {<span class="pl-k">return</span> <span class="pl-c1">null</span>}',
};
