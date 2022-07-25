
const { spawn } = require('node:child_process');
const path = require('path');
const {init} = require('typedoc-plugin-hot-dev');

const buildScriptPath = path.join(__dirname, 'scripts/build.sh');

new Promise((resolve, reject) => {
	const build = spawner('bash', [buildScriptPath]);
	build.on('close', (code) => code === 0? resolve(true) : reject(code));
})
.then(() => {
	const sass = spawner('npm', ['run', 'build:css:watch']);
	init()
})
.catch(err => {throw err;})

function spawner(command, args){
	const spawned = spawn(command, args);
	spawned.stdout.on('data', (data) => {
		const message = String(data).trim();
		console.log(`[${command}] ${message}`)
	});
	spawned.stderr.on('data', (data) => {
		const message = String(data).trim();
		console.log(`[${command}: error] ${message}`)
	});
	return spawned
}

