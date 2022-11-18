import sinon from 'sinon';

export const baseElementVars = [
	'props',
	'componentName',
	'templateDir',
	'dataDir',
	'errors',
];

export const baseElementFunctions = [
	'makeElement',
	'makeContent',
	'makeSignature',
	'makeSpan',
	'appendSpanTo',
	'needsParenthesis',
	'setPropTo',
	'setPropsTo',
	'fetchTemplate',
	'fetchData',
	'fetchReflectionById',
];

export const stubDataFile = {
	id: 0,
	foo: 'foo',
	children: [
		{
			id: 1,
			foo: 'bar',
		},
	],
};

const templateDir = 'src/frontend/templates';
const stubDir = 'test/src/frontend/stubs/files';
const fileMap: { [key: string]: string } = {
	typedocThemeYaf: templateDir,
	yafChromeLeft: templateDir,
	yafNavigationMenu: templateDir,
	yafChromeContent: templateDir,
	stubTemplateHtml: stubDir,
	stubTemplateCss: stubDir,
	reflectionMap: stubDir,
	stubDataFile: stubDir,
	stubDataText: stubDir,
};
export const makeFetchStub = () => {
	const oldFetch = window.fetch;
	return sinon.stub(window, 'fetch').callsFake((file) => {
		const [fileName, ext] = file
			.toString()
			.split('/')
			.reverse()[0]
			.split('.');
		const filePath = `${fileMap[fileName]}/${fileName}.${ext}`;
		return oldFetch(filePath);
	});
};
export type fetchStub = ReturnType<typeof makeFetchStub>;
