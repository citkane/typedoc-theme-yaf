
const { spawn } = require('node:child_process');
const {init} = require('typedoc-plugin-hot-dev');


const sass = spawner('npm', ['run', 'build:css:watch']);
init()

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

