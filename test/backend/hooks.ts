/* eslint-disable @typescript-eslint/no-explicit-any */
process.env.Node = 'test';

import * as fs from 'fs-extra';
import { tmpDirTest } from './stubs/stubs';
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import deepEqualInAnyOrder from 'deep-equal-in-any-order';

chai.use(chaiAsPromised);
chai.use(deepEqualInAnyOrder);

export const mochaHooks = {
	async beforeAll(done: () => void) {
		fs.removeSync(tmpDirTest);
		//fs.ensureDirSync(tmpDirTest);
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
