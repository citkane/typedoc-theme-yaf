import { serialize, YafTheme } from '../../../dist/src';
import {
	rootDir,
	expectedThemeAssets,
	menuBranchKeys,
	highlighttest,
	tmpDirTestDocs,
} from './stubs/stubs';
import * as lib from '../../../dist/src/preProcessor/lib';
import chai, { assert } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import path from 'path';
import fs from 'fs-extra';
import {
	Application,
	DeclarationReflection,
	DefaultThemeRenderContext,
	PageEvent,
	ProjectReflection,
	Reflection,
	RendererEvent,
} from 'typedoc';
import { bootstrapApp, mapDirStructure } from './stubs/utils';
import { highlighter, YAFDataObject } from '../../../dist/src/types';

chai.use(chaiAsPromised);

describe('Server side pre-processor', function () {
	let theme: YafTheme,
		stubClassReflection: DeclarationReflection,
		context: DefaultThemeRenderContext,
		highlighter: highlighter,
		dataArray: YAFDataObject[];
	const app = new Application();
	const project = bootstrapApp(app);

	describe('Class YafTheme Unit Tests', function () {
		const Theme = (<any>app.renderer).themes.get('yaf');
		it('Loads the theme', function () {
			assert.isFunction(Theme, 'theme did not load');
		});
		theme = new Theme(app.renderer);
		it('overrides the default render function', function () {
			assert.equal(
				theme.render({
					preventDefault: () => null,
				} as PageEvent<Reflection>),
				''
			);
		});
		it('extends the default theme class', function () {
			assert.containsAllKeys(
				theme,
				[
					'context',
					'docDir',
					'prepareYafTheme',
					'saveYafThemeAssets',
					'project',
					'projectObject',
					'menuData',
					'reflectionDataObjects',
					'reflectionMapData',
				],
				'the default theme was not fully extended'
			);
		});
		it('has converted the documentation to reflections', function () {
			assert.isTrue(
				!!project,
				'documentation project reflection was not created'
			);
			assert.isTrue(
				project.children.length === 3,
				'incorrect structure to project relection'
			);
			stubClassReflection = project.children.find(
				(reflection) => reflection.name === 'StubClass'
			);
			assert.isTrue(
				!!stubClassReflection,
				'`Stub` class reflection was not created'
			);
			assert.isTrue(
				stubClassReflection.children.length === 3,
				'incorrect structure to `Stub` class reflection'
			);
		});
		it('creates a render context', function () {
			context = theme.getRenderContext();
			assert.isTrue(
				context.constructor.name === 'DefaultThemeRenderContext',
				'did not correctly construct a context'
			);
		});
	});

	describe('lib utilities Unit Tests', function () {
		it('copies theme src files to the given target location', function () {
			//const outDir = path.join(tmpDirTest, 'docs');
			lib.copyThemeFiles(rootDir, tmpDirTestDocs);
			assert.deepEqual(
				mapDirStructure(tmpDirTestDocs),
				expectedThemeAssets,
				'theme src files were not copied as expected'
			);
		});

		it('saves a data file to disk', function () {
			let fileLocation: string;
			lib.saveDataFile(
				'testData.JsOn',
				tmpDirTestDocs,
				{
					test: 'test',
				} as unknown as YAFDataObject,
				false
			);
			fileLocation = path.join(tmpDirTestDocs, 'testData.json');
			assert.isTrue(
				fs.existsSync(fileLocation),
				`data file was not found: ${fileLocation}`
			);
			lib.saveDataFile('testData', tmpDirTestDocs, {
				test: 'test',
			} as unknown as YAFDataObject);
			fileLocation = path.join(
				tmpDirTestDocs,
				'webComponents/data/testData.json'
			);
			assert.isTrue(
				fs.existsSync(fileLocation),
				`data file was not found: ${fileLocation}`
			);
			fs.removeSync(fileLocation);
		});

		it('correctly formats a reflection location', function () {
			const reflection = stubClassReflection.children.find(
				(reflection) => reflection.name === 'bar'
			);
			assert.deepEqual(
				{ hash: 'bar', query: 'StubClass', isLeaf: true },
				lib.formatReflectionLocation(reflection)
			);
		});

		it('builds a navigation menu tree', function () {
			const navTree = lib.buildNavTree({}, project);
			assert.isTrue(!!navTree, 'did not create menu object');
			const stubClassBranch =
				navTree[
					Object.keys(navTree).find(
						(key) => navTree[key].name === 'StubClass'
					)
				];
			assert.isTrue(
				!!stubClassBranch,
				'did not create a menu branch for `StubClass`'
			);
			assert.hasAllKeys(
				stubClassBranch,
				menuBranchKeys,
				'incorrect menu object structure'
			);
			assert.isObject(stubClassBranch['children']);
			assert.equal(Object.keys(stubClassBranch).length, 4);
		});

		it('parses the project to an array of data objects', function () {
			dataArray = lib.parseProject(
				app.serializer.toObject(project) as YAFDataObject,
				project as ProjectReflection & DeclarationReflection,
				context
			);
			assert.isArray(dataArray);
			assert.equal(dataArray.length, 4);
			assert.deepEqual(
				['typedoc-theme-yaf', 'StubClass', 'stubType', 'stubFunction'],
				dataArray.map((data) => data.name)
			);
		});

		it("maps reflection id's to data locations", function () {
			const locationMap = lib.makeReflectionMapData(dataArray);
			assert.equal(Object.keys(locationMap).length, 7);
			Object.keys(locationMap).forEach((key) => {
				assert.hasAllKeys(locationMap[key], ['fileName', 'level']);
				assert.isString(locationMap[key]['fileName']);
				const level = locationMap[key]['level'];
				assert.isTrue(level === 0 || level === 1);
			});
			assert.throws(
				() => lib.makeReflectionMapData([...dataArray, dataArray[0]]),
				'Reflection ID was already mapped'
			);
		});

		it('loads the `starry-night` highlighter', async function () {
			highlighter = await lib.loadHighlighter();
			assert.deepEqual(
				['toHtml', 'flagToScope', 'highlight'],
				Object.keys(highlighter)
			);
			Object.keys(highlighter).forEach((key) => {
				assert.isFunction(highlighter[key], `${key} is not a function`);
			});
		});

		it('highlights a string to html', function () {
			assert.equal(
				lib.getHighlighted(highlighter, highlighttest.input),
				highlighttest.output
			);
			assert.equal(
				lib.getHighlighted(highlighter, highlighttest.input, 'noLang'),
				highlighttest.input
			);
		});
	});
	describe('serializer Unit Tests', function () {
		it('extends the typeDoc serialized object', function () {
			const extendedObject = serialize(
				app.serializer.toObject(project) as YAFDataObject,
				project as ProjectReflection & DeclarationReflection,
				context
			);
			//console.log(extendedObject);
			['is', 'location', 'text', 'has'].forEach((key) => {
				assert.isObject(
					extendedObject[key],
					`${key} is not an object.`
				);
			});
		});
	});
	describe('Class YafTheme End to End test', function () {
		fs.removeSync(tmpDirTestDocs);
		it('prepares the theme and saves data files', async function () {
			theme.docDir = tmpDirTestDocs;
			await assert.isFulfilled(
				theme.prepareYafTheme({ project } as RendererEvent)
			);
			const files = mapDirStructure(tmpDirTestDocs);

			assert.hasAllKeys(files, ['assets', 'files', 'webComponents']);
			assert.hasAllKeys(files['webComponents'], [
				'components',
				'data',
				'files',
				'lib',
				'templates',
			]);
			assert.deepEqual(files['webComponents']['data']['files'], [
				'StubClass.json',
				'index.json',
				'reflectionMap.json',
				'stubFunction.json',
				'stubType.json',
				'yafNavigationMenu.json',
			]);
		});
	});
});
