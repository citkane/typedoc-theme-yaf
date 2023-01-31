import path from 'path';
import fs from 'fs-extra';
import { Application, Logger, TSConfigReader, TypeDocReader } from 'typedoc';

export const rootDir = path.join(__dirname, '../../../../');

const rootDirTest = path.join(rootDir, 'test');
const srcDirBackend = path.join(rootDirTest, 'backend');
const srcDirFrontend = path.join(rootDirTest, 'frontend');
//const srcDirTestDoc = path.join(rootDirTest, 'examples');
const srcTsDocOptions = path.join(rootDirTest, 'typedoc.json');
//const srcTsOptions = path.join(rootDirTest, 'examples.tsconfig.json');

export const stubDir = path.join(srcDirBackend, 'stubs');
export const tmpDirTest = path.join(rootDirTest, 'temp');
export const tmpDirTestDocs = path.join(tmpDirTest, 'docs');

export const highlighttest = {
	input: 'function test():void {return null}',
	output: '<span class="pl-k">function</span> <span class="pl-en">test</span>()<span class="pl-k">:</span><span class="pl-c1">void</span> {<span class="pl-k">return</span> <span class="pl-c1">null</span>}',
};

export const bootstrapApp = async (
	load: (app: Application) => Promise<void>,
	app: Application
) => {
	app.options.addReader(new TypeDocReader());
	app.options.addReader(new TSConfigReader());

	app.options.setValue('options', srcTsDocOptions);
	//app.options.setValue('tsconfig', srcTsOptions);
	//app.options.setValue('out', tmpDirTestDocs);
	//app.options.setValue('entryPoints', [srcDirTestDoc]);

	await load(app);
	app.options.read(new Logger());
	return app;
};

export const mapDirStructure = (dir: string, tree: object = {}) => {
	fs.readdirSync(dir).forEach((sub) => {
		const fullSub = path.join(dir, sub);
		if (fs.lstatSync(fullSub).isDirectory()) {
			tree[sub] = mapDirStructure(fullSub);
		} else {
			if (!tree['files']) tree['files'] = [];
			tree['files'].push(sub);
		}
	});
	return tree;
};
