import {
	componentName,
	materialIcon,
	TypeContext,
	YAFDataObject,
} from '../types/types.js';

import { fetchFile, toCamelCase } from './lib/utils.js';
import { abnormalSigTypes } from '../types/types.js';
import { YafSignature } from './components/YafSignature.js';
import { errorHandlers } from './lib/errors.js';
import { YafNavigationLink } from './components/YafNavigationLink.js';

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
	/** The `props` of the component used for passing data objects into. This is not HTML attributes.*/
	props: unknown;

	errorHandlers = errorHandlers;

	constructor(component: componentName) {
		super();
		this.componentName = component;
	}

	/**
	 * Creates a new HTML element from a string
	 * @param html
	 * @returns
	 */
	makeElement = <T = HTMLElement, P = Record<string, unknown> | string>(
		tagName: string,
		className?: string | null,
		innerText?: string | null,
		props?: P,
		is?: componentName
	) => {
		const element = is
			? document.createElement(tagName, { is })
			: document.createElement(tagName);
		if (className)
			className.split(' ').forEach((c) => element.classList.add(c));
		if (innerText) element.innerText = innerText;
		if (props) (<any>element).props = props;

		return element as T;
	};

	makeSymbolSpan = (text: string) => this.makeElement('span', 'symbol', text);
	makeNameSpan = (text: string) => this.makeElement('span', 'name', text);
	makeTypeSpan = (text: string) => this.makeElement('span', 'type', text);
	makeTitleSpan = (text: string) => this.makeElement('span', 'title', text);
	makeKindSpan = (text: string) => this.makeElement('span', 'kind', text);
	makeValueSpan = (text: string) => this.makeElement('span', 'value', text);
	makeParametersSpan = (text: string) =>
		this.makeElement('span', 'parameters', text);
	makeLiteralSpan = (text: string) =>
		this.makeElement('span', 'literal', text);

	/**
	 * Creates a fontset based icon in a span
	 * @param iconInnerHtml
	 * @param size
	 * @returns
	 */
	makeIconSpan = (
		iconInnerHtml: materialIcon,
		size: 18 | 24 | 36 | 48 = 24
	): Element => {
		return this.makeElement(
			'span',
			`${iconClass} md-${size} yaficon`,
			iconInnerHtml
		);
	};
	makeLinkElement = (
		href: string,
		className?: string,
		innerText?: string
	) => {
		const link = this.makeElement<YafNavigationLink>(
			'a',
			className,
			innerText,
			undefined,
			'yaf-navigation-link'
		);
		link.setAttribute('href', href);
		return link;
	};

	getHtmlTemplate = () => {
		const template = <HTMLTemplateElement>(
			document.getElementById(this.componentName)
		);
		return template
			? template.content
			: this.errorHandlers.notFound(
					`Could not find the HTMLTemplate for ${this.componentName}.`
			  );
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

	/*
	fetchReflectionById = (id: number): Promise<YAFDataObject> => {
		return new Promise((resolve) => {
			this.body.dispatchEvent(
				action.fetch.reflectionById(id, (reflection) =>
					resolve(reflection)
				)
			);
		});
	};
*/
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
		if (!type) return this.makeElement('span', null, 'value');
		const signature = this.makeElement<YafSignature>('yaf-signature');
		signature.props = {
			type,
			context,
		};
		return signature;
	};

	count = 0;
	debounce = () => {
		if (this.count) {
			//console.debug(`${this.constructor.name} was debounced`);
			return true;
		}
		this.count++;
		return false;
	};
}
