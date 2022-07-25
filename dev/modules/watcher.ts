/**
 * This is a developer helper script for hot theme development.
 * 
 * It:
 * - watches for changes on this `src` files (ts, tsx, etc defined in this tsconfig).
 * - rebuilds to this `dist` folder (defined in this tsconfig).
 * - uses **this** updated `dist` to rebuild **that** documentation automatically.
 * - watches for changes to assets (css, js, images, etc.) and does a quick update to that documentation 
 * 
 * For the love of turtles all the way down, **that**, by default, is **this** and will build this documentation set.
 * 
 * @module
 */

const chokidar = require('chokidar');
const path = require('path');
const TypeDoc = require("typedoc");
const { spawn } = require('node:child_process');
const fs = require('fs-extra');
const browserSync = require('browser-sync').create();

/**
 * The development options which can be overridden by "devOptions.json" in the project root directory.
 * 
 */
export interface devOptions {
	/**The name of the document directory in the target documentation project. Typically 'docs'*/
	thatDocDir: string,
	/**The full or relative path of the root of the target documentation directory */
	thatCwdPath: string,
	/**The path relative to this root directory to put compiled code in. Typically `./dist`*/
	thisDistPath: string,
	/**The path relative to this root directory where assets (.js, .css, images, etc) are stored*/
	thisAssetsPath: string
};

const defaultDevOptions: devOptions = {
	thatDocDir: 'docs',
	thatCwdPath: './',
	thisDistPath: './dist',
	thisAssetsPath: './assets'
}

const args = process.argv.slice(2);
if (args.length && args[0] === 'spawned') {
	// We are in a spawned process
	const thatDocDir = args[1];
	const app = new TypeDoc.Application();
	app.options.addReader(new TypeDoc.TSConfigReader());
	app.options.addReader(new TypeDoc.TypeDocReader());
	app.bootstrap();
	const project = app.convert();
	buildDocs(app, project, thatDocDir);

	// Only do quick build to update assets
	process.stdin.on('data', (message: Buffer | string) => {
		message = message.toString().trim();
		console.log(`---------------------------------------- ${message}`)
		if (message === 'buildDocs') buildDocs(app, project, thatDocDir);
	})
}
export function init(...tscOptions){
	if (tscOptions.indexOf('--watch') < 0)  tscOptions.push('--watch');
	// We are in the local process
	let controller = new AbortController();
	const { thatDocDir, thisDistPath, thisAssetsPath, thatCwdPath } = makeOptions();

	startTsc().then((resolved) => {
		resolved = true;
		let tsdoc: any;
		let timer: ReturnType<typeof setTimeout>;

		({ controller, tsdoc } = spawnTsDoc(thatDocDir, thatCwdPath, controller));
		startHttpServer(thatCwdPath, thatDocDir);

		chokidar.watch([
			thisDistPath,
			thisAssetsPath
		], {ignoreInitial: true})
		.on('unlink', (path: string) => callBack(path, 'unlink'))
		.on('add',(path: string) => callBack(path, 'add'))
		.on('change', (path: string) => callBack(path, 'change'));

		function callBack(path: string, event: string) {
			//console.log(path, event); //for debugging
			clearTimeout(timer);
			timer = setTimeout(() => {
				if (path.startsWith(thisAssetsPath)) {
					console.log('---------------------------------------- change asset');
					tsdoc.stdin.write('buildDocs');
				} else {
					console.log('---------------------------------------- change source');
					({ controller, tsdoc } = spawnTsDoc(thatDocDir, thatCwdPath, controller));
				}
			}, 100)
		}
	})
}
function startHttpServer(thatCwdPath: string, thatDocDir: string, isRetry = false){
	const httpPath = path.join(thatCwdPath, thatDocDir);
	const httpIndexPath = path.join(httpPath, 'index.html');
	if (!fs.existsSync(httpIndexPath)) {
		if (!isRetry) console.log(`[warning] waiting to see "${httpIndexPath}" so that the http server can start.\n`);
		setTimeout(() => startHttpServer(thatCwdPath, thatDocDir, true), 1000)
	} else {
		browserSync.init({server: httpPath});
	}	
}
function buildDocs(app: any, project: any, thatDocDir: string) {
	app.generateDocs(project, thatDocDir)
		.then(() => {
			console.log('---------------------------------------- build done');
		})
		.catch((err: Error) => console.error(err));
}
function makeOptions(): devOptions {
	const options = defaultDevOptions;
	const rootPath = process.cwd();
	const optionsPath = path.join(rootPath, 'devOptions.json')
	if (fs.existsSync(optionsPath)) {
		const devOptions: devOptions = require(optionsPath);
		Object.keys(devOptions).forEach((key) => {
			options[key as keyof devOptions] = devOptions[key as keyof devOptions]
		})
	}
	['thatCwdPath', 'thisDistPath', 'thisAssetsPath'].forEach(key => {
		let optionPath = path.join(rootPath, options[key as keyof devOptions]);
		if (fs.existsSync(optionPath)) {
			options[key as keyof devOptions] = optionPath;
		} else if (!fs.existsSync(options[key as keyof devOptions])) {
			throw new Error(`watcher: path "${optionPath}" for option "${key}" does not exists`);
		}
	})
	return options
}

function startTsc() {
	return new Promise((resolve) => {
		let resolved = false;
		const tsc = spawn('node_modules/.bin/tsc', ['--build', '--watch']);
		tsc.on('error', (err: Error) => console.error(err));
		tsc.stdout.on('data', (data: Buffer) => {
			const message = String(data).trim();
			console.log(message)
			if (!resolved && message.endsWith('Watching for file changes.')) resolve(resolved);
		});
	});
}

function spawnTsDoc (
	thatDocDir: string,
	cwd: string,
	controller?: AbortController
): { controller: AbortController, tsdoc: any } {

	controller?.abort();
	controller = new AbortController();
	const { signal } = controller;

	const tsdoc = spawn('node', [__filename, 'spawned', thatDocDir], {cwd, signal});

	tsdoc.on('error', (err: Error) => {
		if (err.message !== 'The operation was aborted') {
			console.error(`xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx ${err.message}`)
		};
	})
	tsdoc.stdout.on('data', (data: Buffer) => {
		const message = data.toString().trim();
		console.log(message)
		if (message.endsWith('build done')) browserSync.reload();
	});	
	tsdoc.stderr.on('data', (data: Buffer) => { console.error(`stderr: ${data}`) });
	return { controller, tsdoc }
}

























