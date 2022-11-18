export default {
	testRunnerHtml: (testFramework) => `
    <html>
      <body>
        <script type="module" src="${testFramework}"></script>
      </body>
    </html>
    `,
	coverage: true,
	files: 'test/dist/frontend/index.spec.js',
	nodeResolve: true,
	coverageConfig: {
		report: true,
		reporters: ['html', 'clover'],
		reportDir: 'test/coverage/frontend',
		include: ['dist/src/frontend/**/*.js'],
	},
};
