import {
	allTypes,
	componentName,
	htmlString,
	reflectionMap,
	treeMenuRoot,
	TypeContext,
	YAFDataObject,
} from '../types.js';
import { eventConstruct } from './eventApi.js';
import { needsParenthesis } from './utils.js';
const defaultTemplateDir = './webComponents/templates';
const defaultDataDir = './webComponents/data';
const body = document.querySelector('body') as HTMLBodyElement;

// eslint-disable-next-line @typescript-eslint/no-empty-interface

export class YAFElement extends HTMLElement {
	componentName: componentName;
	templateDir: string;
	dataDir: string;
	props: unknown;
	constructor(
		component: componentName,
		templateDir = defaultTemplateDir,
		dataDir = defaultDataDir
	) {
		super();

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		this.props = (<any>this).props ? { ...(<any>this).props } : {};
		this.componentName = component;
		this.templateDir = templateDir;
		this.dataDir = dataDir;
	}
	protected makeElement(innerHTML: htmlString): Element {
		const documentFragment = this.makeContent(innerHTML);
		return documentFragment.firstElementChild?.cloneNode(true) as Element;
	}
	protected makeContent(innerHtml: htmlString): DocumentFragment {
		const template = document.createElement('template');
		template.innerHTML = innerHtml.trim();
		return template.content;
	}
	protected makeSignature(type: YAFDataObject['type'], context: TypeContext) {
		const parenthesis = needsParenthesis[type?.type || 'unknown'](context);
		const typeName = type?.type.replace(/-\D/g, (x) => {
			return (x[1] || '').toUpperCase();
		});
		const signatureType = this.makeElement(
			parenthesis
				? `<yaf-content-signature-${typeName} needsParenthesis />`
				: `<yaf-content-signature-${typeName} />`
		);
		this.setPropsTo(signatureType, <allTypes>type);
		return signatureType;
	}
	protected makeSpan(inner: string, className?: string) {
		return this.makeElement(
			className
				? `<span class="${className}">${inner}</span>`
				: `<span>${inner}</span>`
		);
	}
	protected appendSpanTo(
		inner: string,
		className?: string,
		parent: Element = this
	) {
		parent.appendChild(this.makeSpan(inner, className));
	}
	protected needsParenthesis() {
		return this.hasAttribute('needsParenthesis');
	}
	protected setPropTo(element: Element, propName: string, value: unknown) {
		const xElement = element as Element & {
			props: { [key: string]: unknown };
		};
		if (!xElement.props) xElement.props = {};
		xElement.props[propName] = value;
	}
	protected setPropsTo(element: Element, props: { [key: string]: unknown }) {
		Object.keys(props).forEach((key) => {
			this.setPropTo(element, key, props[key]);
		});
	}
	protected fetchTemplate = async (
		extension: 'html' | 'css',
		componentName = this.componentName
	): Promise<htmlString> => {
		const url = `${this.templateDir}/${toCamelCase(
			componentName
		)}.${extension}`;
		const dataString = (await fetch(url)
			.then((stream) => stream.text())
			.then((string) => string)
			.catch((err) => {
				console.error(err);
				return `<div>${err.message}</div>`;
			})) as htmlString;
		return extension === 'css'
			? `<style>${dataString}</style>`
			: (dataString as htmlString);
	};
	protected fetchData = async (
		fileName: string
	): Promise<reflectionMap & YAFDataObject & treeMenuRoot> => {
		fileName = fileName.endsWith('.json') ? fileName : `${fileName}.json`;
		const filePath = `${this.dataDir}/${fileName}`;
		const data = await fetch(filePath).then((stream) => stream.json());
		return data;
	};
	protected fetchReflectionById(id: number): Promise<YAFDataObject> {
		return new Promise((resolve) => {
			body.dispatchEvent(
				eventConstruct.fetch.reflectionById(id, (reflection) => {
					resolve(reflection);
				})
			);
		});
	}
}

export function toCamelCase(componentName: string) {
	const varNameArray = componentName.split('-').map((item, i) => {
		return i ? `${item.charAt(0).toUpperCase()}${item.slice(1)}` : item;
	});
	return varNameArray.join('');
}
/*
export function joinPaths(...pathStrings: string[]) {
	console.log(pathStrings);
	let pathString = pathStrings.join('/');
	pathString = pathString.replace(/\\/g, '/');
	pathString = pathString.replace(/\/+/g, '/');
	console.log(pathString);
	return pathString;
}


	protected async getHtml(
		subDir = '/',
		component: componentName = this.componentName
	): Promise<html> {
		return await this.fetchTemplate(subDir, toCamelCase(component), 'html');
	}
	protected async getCss(
		component: componentName = this.componentName
	): Promise<html> {
		return await this.fetchTemplate(toCamelCase(component), 'css');
	}
	*/
/**
 * Converts a relative path to a typedoc partial resource into an absolute path.
 * @param locationPath
 * @returns an absolute path to the resource
 */
/*
	protected relToAbsPath = async (locationPath: fragmentUrl) => {
		locationPath = locationPath.replace(
			/\.\.\/|\.\/|^\//g,
			''
		) as fragmentUrl;
		const pathname = window.location.pathname;
		const yafRoot = (await this.fetchData('yaf-root')) as string[];
		let subPath = yafRoot.find(
			(subPath) => pathname.indexOf(`/${subPath}`) > -1
		);
		subPath = pathname.split(`${subPath}/`)[0];
		return `${subPath}${locationPath}` as fragmentUrl;
	};
	*/
/**
 * Fetches html or css from the server and converts it to a string
 * @param url
 * @returns a string of html or raw css
 */
/*
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
	*/
