import { assert } from '@open-wc/testing';
import * as util from '../../../../dist/src/frontend/lib/utils';
import { stubDataFile } from '../stubs/stubs';

export default () =>
	describe('Unit tests for frontend utilities', function () {
		it('converts a Element name to camelcase', function () {
			assert.equal(
				util.toCamelCase('test-component-name'),
				'testComponentName'
			);
		});
		it('fetches a file as JSON parsed from the server', async function () {
			const data = await util.fetchFile('stubDataFile.json', 'json');
			assert.deepEqual(data, stubDataFile);
		});
		it('fetches a file as text parsed from the server', async function () {
			const data = await util.fetchFile('stubDataText.txt', 'text');
			assert.deepEqual(data, 'stub data text');
		});
		it('errors if a fetched file is not found', async function () {
			return assert.isRejected(
				util.fetchFile('noSuchFile', 'json'),
				'Not Found: noSuchFile'
			);
		});
		it('returns the need for parenthesis given a signature type and context', function () {
			const falseTypes: (keyof typeof util.needsParenthesis)[] = [
				'array',
				'indexedAccess',
				'intrinsic',
				'literal',
				'mapped',
				'named-tuple-member',
				'optional',
				'predicate',
				'query',
				'reference',
				'reflection',
				'rest',
				'template-literal',
				'tuple',
			];
			falseTypes.forEach((type) =>
				//@ts-expect-error Shut tfu ts...
				assert.isFalse(util.needsParenthesis[type]())
			);
			assert.isTrue(util.needsParenthesis.conditional('arrayElement'));
			assert.isTrue(util.needsParenthesis.inferred('indexedObject'));
			assert.isTrue(util.needsParenthesis.intersection('indexedObject'));
			assert.isTrue(
				util.needsParenthesis.typeOperator('optionalElement')
			);
			assert.isTrue(util.needsParenthesis.union('indexedObject'));
			assert.isTrue(util.needsParenthesis.unknown('indexedObject'));
		});
	});
