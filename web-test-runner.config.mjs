import fs from 'fs-extra';
import path from 'path';
import { visualRegressionPlugin } from '@web/test-runner-visual-regression/plugin';
import { playwrightLauncher } from '@web/test-runner-playwright';

const html = fs.readFileSync('./dist/src/index.html').toString();
const versions = fs.readJSONSync('test/temp/docs/.typedoc-plugin-versions');
const version = versions.versions[0];

fs.copyFileSync(
	path.join('./test', 'dist', 'frontend', 'index.spec.js'),
	path.join('./test', 'temp', 'docs', version, 'index.spec.js')
);

export default {
	testRunnerHtml: (testFramework) =>
		html.replace(
			'<!-- insert test code here -->',
			`<script type="module" src="${testFramework}"></script>`
		),
	coverage: true,
	files: `./test/temp/docs/${version}/index.spec.js`,
	rootDir: `./test/temp/docs/${version}`,
	nodeResolve: true,
	coverageConfig: {
		report: true,
		reporters: ['html', 'clover'],
		reportDir: 'test/coverage/frontend',
		include: ['dist/src/frontend/**/*.js'],
	},
	browsers: [
		playwrightLauncher({
			product: 'chromium',
			launchOptions: {
				headless: true,
			},
		}),
	],
	plugins: [
		visualRegressionPlugin({
			// eslint-disable-next-line no-undef
			update: process.argv.includes('--update-visual-baseline'),
			baseDir: './test/screenshots',
			failureThresholdType: 'percent',
			failureThreshold: 1.2,
		}),
	],
	manual: false,
	open: false,
	testFramework: {
		config: {
			bail: true,
			retries: 3,
		},
	},
	testsFinishTimeout: 960000,
};
