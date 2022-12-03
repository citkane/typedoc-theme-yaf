## Typedoc-theme-yaf

A opinionated Typedoc theme to suit myself.
Just started - under heavy development!

# Some testing scrap stuff below, please ignore

```ts
export class TypedocThemeYaf extends YAFElement {
	//shadow: ShadowRoot;
	constructor() {
		super(componentName);
		//this.shadow = this.attachShadow({ mode: 'open' });
		this.setTheme(this.theme);
	}
	theme = 'light' as 'light' | 'dark';
	async connectedCallback() {
		const html = await this.fetchTemplate('html');
		const css = await this.fetchTemplate('css');
		const innerHtml = this.makeContent(html);
		const innerCss = YafElement.makeElement(css);
		this.appendChild(innerCss);
		this.appendChild(innerHtml);
	}
	setTheme(theme: 'light' | 'dark') {
		document.body.classList.remove(
			theme === 'dark' ? 'lightTheme' : 'darkTheme'
		);
		document.body.classList.add(
			theme === 'dark' ? 'darkTheme' : 'lightTheme'
		);
		this.theme = theme;
	}
}
customElements.define(componentName, TypedocThemeYaf);
```

[![RELEASE AND PUBLISH](https://github.com/citkane/typedoc-plugin-versions/actions/workflows/release.yml/badge.svg)](https://github.com/citkane/typedoc-plugin-versions/actions/workflows/release.yml)
[![codecov](https://codecov.io/gh/citkane/typedoc-plugin-versions/branch/main/graph/badge.svg?token=5DDL83JO0R)](https://codecov.io/gh/citkane/typedoc-plugin-versions)
[![GitHub](https://badgen.net/badge/icon/github?icon=github&label)](https://github.com/citkane/typedoc-plugin-versions)
[![Npm](https://badgen.net/badge/icon/npm?icon=npm&label)](https://npmjs.com/package/typedoc-plugin-versions)
[![docs stable](https://img.shields.io/badge/docs-stable-teal.svg)](https://citkane.github.io/typedoc-plugin-versions/stable)
[![docs stable](https://img.shields.io/badge/docs-dev-teal.svg)](https://citkane.github.io/typedoc-plugin-versions/dev)

# ↹ typedoc-plugin-versions

<img src="./media/Screenshot.jpg" width="300px" height="auto" border="1px solid light-grey" /><br><br>
**It keeps track of your document builds and provides a select menu for versions.**
<br /><br />
Built for: <a href = "https://semver.org/" target="_blank">semantic versioning</a>.

<br /><br />

## Usage

Install:

```shell
npm i -D typedoc-plugin-versions
```

and then set up your environment in typedoc.json

```jsonc
"plugin": ["typedoc-plugin-versions"],
"versions": { /*...options */ }
```

<br /><br />

## Options

| Key               | Value Information                                                                                                         | Type     | Required | Default                                                                                                                                                                              |
| :---------------- | ------------------------------------------------------------------------------------------------------------------------- | -------- | :------: | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **_stable_**      | The version that you would like to be marked as `stable`                                                                  | `string` |  **no**  | [Automatically inferred](https://github.com/citkane/typedoc-plugin-versions/wiki/%22stable%22-and-%22dev%22-version-automatic-inference) based on current version and build history. |
| **_dev_**         | The version that you would like to be marked as `dev`                                                                     | `string` |  **no**  | [Automatically inferred](https://github.com/citkane/typedoc-plugin-versions/wiki/%22stable%22-and-%22dev%22-version-automatic-inference) based on current version and build history. |
| **_domLocation_** | A custom DOM location to render the HTML `select` dropdown corresponding to typedoc rendererHooks, eg. "navigation.begin" | `string` |  **no**  | Injects to left of header using vanilla js - not a typedoc render hook.                                                                                                              |

<br /><br />

## "What sorcery is this?", you may ask...

Typedoc-plugin-versions takes the architectural approach of [JuliaLang Documenter](https://juliadocs.github.io/Documenter.jl/stable/).

Documents are built into subdirectories corresponding to the package.json version.  
Symlinks are created to minor versions, which are given as options in a `select` menu.

As long as you do not delete your historic document build folders, the document history remains intact.

If you want to remove a historic version, delete the old folder and rebuild your documentation.

<br /><br />

## CID

Below is an opinionated Github CI setup. You can hack and change it to suite your needs.

**How to for Github Actions**:

-   In your project's `package.json`, set up scripts for:
    -   **build** - to build your project, eg. "tsc --outDir ./dist"
    -   **docs** - to build your documents, eg "typedoc --out ./docs"
-   Ensure that your documents are being built into a folder named `./docs` (or change your workflow file appropriately)
-   Create an empty branch called gh-pages
-   Under your repository's 'Pages' settings, set:
    -   **Source**: Deploy from a branch
    -   **Branch**: gh-pages/docs (symlinks won't work in the gh-pages/root folder)
-   Create a [custom workflow](https://docs.github.com/en/actions/quickstart) as per [this template](https://github.com/citkane/typedoc-plugin-versions/blob/main/.github/workflows/docs.yml) for PUBLISH DOCS.

The "PUBLISH DOCS" action will create a rolling update to your document set.

<br /><br />

## Development Guidelines and howto's

Please refer to the [Wiki Page](https://github.com/citkane/typedoc-plugin-versions/wiki/Development-Guidelines).
