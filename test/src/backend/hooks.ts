/* eslint-disable @typescript-eslint/no-explicit-any */
process.env.Node = 'test';

import * as fs from 'fs-extra';
//import { spawnSync } from 'child_process';
import { tmpDirTest } from './stubs/stubs';

export const mochaHooks = {
	beforeAll(done: () => void) {
		fs.removeSync(tmpDirTest);
		/*
		(<any>this).timeout(5000);
		fs.ensureDirSync(tmpDir);
		spawnSync('tsc', [
			'--project',
			'src/webComponents/tsconfig.tests.json',
		]);
		*/
		done();
	},
	beforeEach(done: () => void) {
		done();
	},
	afterEach(done: () => void) {
		done();
	},
	afterAll(done: () => void) {
		fs.removeSync(tmpDirTest);
		done();
	},
};
