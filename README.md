## Typedoc-theme-yaf

A opinionated Typedoc theme to suit myself.
Just started - under heavy development!

#### Hot development setup

You can run a hot development environment with `npm run build:hot`.  
This will open a hot browser window which will update with your changes to code and assets.

The default mode is to target the documentation of this module itself, but you can also target an external project by creating a `devOptions.json` file in this project root, eg:
```jsonc
{
	"thatDocDir": "./docs", //external document directory
	"thatCwdPath": "../path/to/other/project"
}
```
The target project must have typedoc correctly set up, and `thatDocDir` must correspond to the `out` of the external project.

**Note**

When targeting an external project for hot development, from that project, you will install typedoc-theme-yaf as so:
```
npm install ../path/to/typedoc-theme-yaf
```

This will create a symlink in ./node_modules,  and cause peerdependies to break. [This is an issue with node](https://github.com/npm/npm/issues/5875).

Workaround from this module directory:
```
npm install ../path/to/external/project/node_modules/typedoc
```

and after development work is done:
```
npm remove typedoc
npm i -D typedoc
```
and fix package.json with:
```jsonc
	"peerDependencies": {
		"typedoc": "^0.23.0" //or whatever version is relevant
	}
```