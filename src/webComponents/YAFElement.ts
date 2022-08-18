import { componentName, css, fragmentUrl, html } from './types.js';

export class YAFElement extends HTMLElement {
	component: componentName;
	constructor(component: componentName) {
		super();
		this.component = component;
	}
	protected makeElement(innerHTML: html): Element {
		const documentFragment = this.makeContent(innerHTML);
		return documentFragment.firstElementChild?.cloneNode(true) as Element;
	}
	protected makeContent(innerHtml: html): DocumentFragment {
		const template = document.createElement('template');
		template.innerHTML = innerHtml.trim();
		return template.content;
	}
	protected async getHtml(
		component: componentName = this.component
	): Promise<html> {
		return await this.fetchTemplate(component, 'html');
	}
	protected async getCss(
		component: componentName = this.component
	): Promise<html> {
		return await this.fetchTemplate(component, 'css');
	}
	/**
	 * Converts a relative path to a typedoc partial resource into an absolute path.
	 * @param locationPath
	 * @returns an absolute path to the resource
	 */
	protected relToAbsPath = (locationPath: fragmentUrl) => {
		locationPath = locationPath.replace(
			/\.\.\/|\.\/|^\//g,
			''
		) as fragmentUrl;
		const pathname = window.location.pathname;
		let subPath = window.yaf.rootSubPaths.find(
			(subPath) => pathname.indexOf(`/${subPath}`) > -1
		);
		subPath = pathname.split(`${subPath}/`)[0];
		return `${subPath}${locationPath}` as fragmentUrl;
	};
	/**
	 * Fetches html or css from the server and converts it to a string
	 * @param url
	 * @returns a string of html or raw css
	 */
	protected async fetchHtmlOrCss(url: fragmentUrl) {
		const string = await fetch(url)
			.then((stream) => stream.text())
			.then((string) => string)
			.catch((err) => {
				console.error(err);
				return `<div>${err.message}</div>`;
			});
		return string as html | css;
	}
	/**
	 * Calculates the URL of a webcomponent resource from it's name and fetches the template from the server.
	 * @param component
	 * @param extension
	 * @returns html or css encapulated in html as a string
	 */
	private fetchTemplate = async (
		component: componentName,
		extension: 'html' | 'css'
	): Promise<html> => {
		const locator = component.replace(/-/g, '.');
		const url = this.relToAbsPath(
			`./webComponents/components/${locator}.${extension}` as fragmentUrl
		);
		const html = await this.fetchHtmlOrCss(url);
		return extension === 'css' ? `<style>${html}</style>` : (html as html);
	};
}
