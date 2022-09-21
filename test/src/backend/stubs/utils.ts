import fs from 'fs-extra';
import path from 'path';
import { Application, Logger, TSConfigReader, TypeDocReader } from 'typedoc';
import { rootDir, srcDirBackend, stubDirTest, tmpDirTestDocs } from './stubs';
import { load } from '../../../../dist/src';

export const bootstrapApp = (app: Application) => {
	app.options.addReader(new TypeDocReader());
	app.options.addReader(new TSConfigReader());

	app.options.setValue('options', srcDirBackend);
	app.options.setValue('tsconfig', srcDirBackend);
	app.options.setValue('out', tmpDirTestDocs);
	app.options.setValue('entryPoints', [
		path.join(stubDirTest, 'toDocument.ts'),
	]);
	app.options.setValue('excludeExternals', true);
	app.options.setValue('plugin', [path.join(rootDir, 'dist')]);
	app.options.setValue('theme', 'yaf');
	app.options.setValue('readme', path.join(stubDirTest, 'README.md'));

	load(app);
	app.options.read(new Logger());
	return app.convert();
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
