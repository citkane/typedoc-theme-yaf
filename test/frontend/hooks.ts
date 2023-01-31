/* eslint-disable @typescript-eslint/no-explicit-any */
process.env.Node = 'test';

import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';

chai.use(chaiAsPromised);

export const mochaHooks = {};
