import { Application, ProjectReflection } from 'typedoc';
import { load } from '../../dist';
import { assert } from 'chai';
import path from 'path';
import fs from 'fs-extra';
import {
	bootstrapApp,
	tmpDirTestDocs,
	mapDirStructure,
	stubDir,
} from './stubs/stubs';

describe('Back-End', function () {
	let app: Application,
		project: ProjectReflection | undefined,
		outDir: string,
		newDataDirStructure: any;
	const expectedOutputDirStructure: any = fs.readJSONSync(
		path.join(stubDir, 'expectedOutputDirStructure.json')
	);
	it('loads the theme', async function () {
		app = await bootstrapApp(load, new Application());
	});
	it('parses the project', function () {
		this.timeout(10000);
		project = app.convert();
		assert.isTrue(
			project && project instanceof ProjectReflection,
			'did not parse the project into a ProjectReflection'
		);
	});
	it('creates theme versioning information structure', async function () {
		app.validate(project!);
		assert.isFalse(
			app.logger.hasErrors(),
			'There were errors rendering data fragments'
		);
		outDir = app.options.getValue('out');
		await app.generateDocs(project!, outDir);

		const version = path.basename(outDir);
		assert.isTrue(
			version.startsWith('v'),
			'version directory is of an incorrect format'
		);

		['index.html', 'versions.js', version].forEach((file) => {
			assert.isTrue(
				fs.existsSync(path.join(tmpDirTestDocs, file)),
				`${path.join(tmpDirTestDocs, file)} does not exist.`
			);
		});
	});
	it('copies the theme resources', function () {
		newDataDirStructure = mapDirStructure(outDir);

		['frontend', 'files', 'media'].forEach((file) => {
			assert.exists(
				newDataDirStructure[file],
				`"${file}" directory not found`
			);
			(<any>assert).deepEqualInAnyOrder(
				expectedOutputDirStructure[file],
				newDataDirStructure[file],
				`"${file}" directory not as expected`
			);
		});
	});
	it('renders the theme data', function () {
		assert.exists(
			newDataDirStructure.data,
			'"data" directory does not found.'
		);
		(<any>assert).deepEqualInAnyOrder(
			newDataDirStructure.data,
			expectedOutputDirStructure.data,
			'"data" directory not as expected'
		);
	});
});
