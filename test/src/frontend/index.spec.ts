// @ts-expect-error The module is there and works. WTF ts...
import chaiAsPromised from '@esm-bundle/chai-as-promised';
import chai from '@esm-bundle/chai';
chai.use(chaiAsPromised);

import '../../../dist/src/frontend';

import unitTestUtils from './lib/utils.spec';
import unitTestEvents from './lib/events.spec';
import unitTestYafElement from './YafElement.spec';

describe('Frontend unit tests', function () {
	this.beforeAll(function () {
		makeFetchStub();
	});
	this.afterAll(function () {
		(<fetchStub>window.fetch).restore();
	});
	unitTestUtils();
	unitTestEvents();
	unitTestYafElement();
});

import typedocThemeYaf from './components/TypedocThemeYaf.spec';
import { fetchStub, makeFetchStub } from './stubs/stubs';
describe('Frontend component unit tests', function () {
	this.beforeAll(function () {
		makeFetchStub();
	});
	this.afterAll(function () {
		(<fetchStub>window.fetch).restore();
	});
	typedocThemeYaf();
});
