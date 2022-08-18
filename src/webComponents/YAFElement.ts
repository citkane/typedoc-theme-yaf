import { componentName, customEventOptions, html } from './types.js';

export class YAFElement extends HTMLElement {
	component: componentName
	constructor(component: componentName) {
		super();
		this.component = component;
	}
	makeShadow(innerHtml: html, mode: ShadowRootMode = 'open'): ShadowRoot{
		const shadow = this.attachShadow({mode});
		shadow.innerHTML = innerHtml.trim();
		return shadow;
	}
	makeElement(innerHTML: html): Element {
		const documentFragment = this.makeContent(innerHTML);
		return documentFragment.firstElementChild?.cloneNode(true) as Element;
	}
	makeContent(innerHtml: html): DocumentFragment {
		const template = document.createElement('template');
		template.innerHTML = innerHtml.trim();
		return template.content;
	}
	getEventDetail(e: Event){
		return (<any>e).detail;
	}
	async getHtml(component: componentName = this.component): Promise<html> {
		return await getTemplate(component, 'html'); 
	}
	async getCss(component: componentName = this.component): Promise<html> {
		return await getTemplate(component, 'css'); 
	}
	async getHtmlAndCss(component: componentName = this.component): Promise<html>{
		let html, css;
		const Promises = [
			html = await this.getHtml(component),
			css = await this.getCss(component)
		]
		await Promise.resolve(Promises);
		return `${css}\n${html}`
	}
	customEvent(options: customEventOptions, eventType: string = this.component){
		return new CustomEvent(eventType, options);
	}
	getUrl = getUrl
}

const getTemplate = async (component: string, extension: 'html'|'css'):Promise<html> => {
	const locator = component.replace(/-/g, '.');
	const locationPath = getUrl(`./webComponents/components/${locator}.${extension}`);
	const string = await fetch(locationPath)
		.then(stream => stream.text())
		.then(string => string)
		.catch(err => {
			console.error(err);
			return ''
		})
	return extension === 'css'? `<style>${string}</style>` : string as html; 
}
const getUrl = (locationPath: string) => {
	locationPath = locationPath.replace(/\.\.\/|\.\/|^\//g, '');
	const pathname = window.location.pathname;
	let subPath = window.yaf.rootSubPaths.find(subPath => (pathname.indexOf(`/${subPath}`) > -1));
	subPath = pathname.split(`${subPath}/`)[0];
	return `${subPath}${locationPath}`
}