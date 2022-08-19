import path from 'path';
import { assert } from 'chai';
import fs from 'fs-extra';
import { saveDataToFile, toCamelCase } from '../src/preprocessor/YafTheme';
import { tmpDir } from './stubs';
import { dotName } from '../src/types';

describe('typedoc-theme-yaf Unit Tests', function () {
	it('parses data files and injects new data.', function () {
		fs.readdirSync(path.join(tmpDir, 'components'))
			.filter((fileName) => fileName.endsWith('data.js'))
			.forEach((fileName) => {
				const fileRoot = path.join(tmpDir, 'components');
				const varDotName = fileName.replace('.data.js', '') as dotName;
				const varName = toCamelCase(varDotName);
				[
					{ foo: { bar: null } }, //test an object
					['one', 'two'], //test an array
					123, //test a number
					'hello string', //test a string
				].forEach(async (data) => {
					saveDataToFile(varDotName, data, fileRoot);
					const savedData = await import(
						path.join(fileRoot, fileName)
					);
					assert.deepEqual(
						savedData[varName],
						data,
						`var "${varName}" in file "${fileRoot}" did not return ${data}`
					);
				});
			});
	});
});
