import {
	componentName,
	htmlString,
	localStorageKeys,
	materialIcon,
	TypeContext,
	YAFDataObject,
} from './types.js';
import { event } from './lib/eventApi.js';
import { fetchFile, toCamelCase } from './lib/utils.js';
import { abnormalSigTypes } from '../types.js';
import { YafSignature } from './components/YafSignature.js';

const defaultTemplateDir = './frontend/templates/';
const defaultDataDir = './frontend/data/';
const iconClass = 'material-icons-sharp';

/**
 * The base class upon which all typedoc-theme-yaf web components are built.
 *
 * It provides:
 * - A number of utility methods to construct HTML Elements
 * - A typesafe method to pass `props` (not HTML attributes) into an element
 * - Various data fetching methods
 * - Various utility methods
 *
 */
export class YafElement extends HTMLElement {
	/** The name of the component in the form `yaf-component-name` */
	componentName: componentName;
	/** The default subdirectory under the web root for web component templates */
	templateDir: string;
	/** The default subdirectory under the web root for documentation data */
	dataDir: string;
	/** The `props` of the component used for passing data objects into. This is not HTML attributes.*/
	props: unknown;
	constructor(
		component: componentName,
		templateDir = defaultTemplateDir,
		dataDir = defaultDataDir
	) {
		super();
		this.componentName = component;
		this.templateDir = templateDir;
		this.dataDir = dataDir;
	}
	count = 0;
	test<T>() {
		const foo: T | string = 'foo';
		console.log(foo);
	}
	/**
	 * The document body which typedoc-theme-yaf uses as the common root for most events.
	 */
	body = document.querySelector('body') as HTMLBodyElement;
	/**
	 * Creates a new HTML element from a string
	 * @param html
	 * @returns
	 */
	makeElement = <T = HTMLElement>(html: htmlString) => {
		const documentFragment = this.makeContent(html);
		return documentFragment.firstChild as T;
	};
	/**
	 * Creates a new HTML document fragment from a string
	 * @param innerHtml
	 * @returns
	 */
	makeContent = (innerHtml: htmlString): DocumentFragment => {
		const template = document.createElement('template');
		template.innerHTML = innerHtml.trim();
		return template.content;
	};
	/**
	 * Creates a fontset based icon in a span
	 * @param icon
	 * @param size
	 * @returns
	 */
	makeIcon = (icon: materialIcon, size: 18 | 24 | 36 | 48 = 24): Element => {
		return this.makeSpan(icon, `${iconClass} md-${size}`);
	};

	/**
	 * @param inner Convenenience method for create a HTML span Element with a class name.
	 * @param className
	 * @returns
	 */
	makeSpan = (inner: string, className?: string) => {
		return this.makeElement<HTMLElement>(
			className
				? `<span class="${className}">${inner}</span>`
				: `<span>${inner}</span>`
		);
	};
	/**
	 * A convenience method for creating and appending a HTML span Element with class name into a parent Element
	 * @param inner
	 * @param className
	 * @param parent
	 */
	appendSpanTo = (
		inner: string,
		className?: string,
		parent: Element = this
	) => {
		parent.appendChild(this.makeSpan(inner, className));
	};

	/**
	 * Fetches the HTML or CSS template for the given component
	 */
	fetchTemplate = async (
		extension: 'html' | 'css',
		componentName = this.componentName,
		dir = this.templateDir
	): Promise<htmlString> => {
		const url = `${dir}${toCamelCase(componentName)}.${extension}`;
		try {
			const dataString = await fetchFile(url, 'text');
			return extension === 'css'
				? `<style>${dataString}</style>`
				: (dataString as htmlString);
		} catch (err) {
			return this.errors.template(err);
		}
	};

	/**
	 * Fetches a .json data file
	 * @param fileName
	 * @returns reflection data
	 */
	fetchData = async <returnType>(fileName: string, dir = this.dataDir) => {
		fileName = fileName.replace(/.JSON$/i, '.json');
		fileName = fileName.endsWith('.json') ? fileName : `${fileName}.json`;
		const filePath = `${dir}${fileName}`;
		return fetchFile(filePath, 'json') as returnType;
	};

	/**
	 * Triggers an event to fetch a .json data file which corresponds to the given reflection id.
	 *
	 * The event listener is registered ??
	 *
	 * @todo document the event registration
	 *
	 * @param id
	 * @returns reflection data
	 */
	fetchReflectionById = (id: number): Promise<YAFDataObject> => {
		return new Promise((resolve) => {
			this.body.dispatchEvent(
				event.fetch.reflectionById(id, (reflection) =>
					resolve(reflection)
				)
			);
		});
	};

	/**
	 * Does this web component need to be wrapped in parenthesis?
	 *
	 * Used in the context of assembling more complex items, eg. signatures
	 * @returns
	 */
	needsParenthesis = () => {
		return this.hasAttribute('needsParenthesis');
	};

	renderSignatureType = (
		type: YAFDataObject['type'] | abnormalSigTypes,
		context: TypeContext
	) => {
		if (!type) return this.makeSpan('any', 'value');
		const signature: YafSignature = this.makeElement('<yaf-signature />');
		signature.props = {
			type,
			context,
		};
		return signature;
	};

	errors = {
		template: (err: unknown): htmlString =>
			`<yaf-error>${(<{ message: string }>err).message}</yaf-error>`,
		data: (err: unknown) => {
			console.error(err);
			return err;
		},
		notFound: (message: string) => console.error(message),
		localStorage: (key: localStorageKeys) => {
			console.error(
				`There was a problem with "localStorage.${key}. It is being removed.`
			);
			window.localStorage.removeItem('key');
		},
	};

	debounce = () => {
		if (this.count) {
			//console.warn(`${this.constructor.name} was debounced`);
			return true;
		}
		this.count++;
		return false;
	};
}
