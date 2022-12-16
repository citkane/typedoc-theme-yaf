import {
	componentName,
	materialIcon,
	TypeContext,
} from '../types/frontendTypes.js';

import { JSONOutput } from 'typedoc';
import { YAFDataObject } from '../types/types';
import { YafNavigationLink } from './webComponents/Navigation/index.js';
import { YafSignature } from './webComponents/Signature/index.js';

import errorHandlers from './lib/ErrorHandlers.js';
import YafElementDrawers from './YafElementDrawers.js';
import { YafWidgetFlags } from './webComponents/Widget/index.js';

const iconClass = 'material-icons-sharp';

/**
 * The base helper library for building typedoc-theme-yaf HTMLCustomElements.
 *
 * It provides:
 * - A number of utility methods to construct HTML Elements
 * - A typesafe method to pass `props` (not HTML attributes) into an element
 * - Various data fetching methods
 * - Various utility methods
 *
 */
const yafElement = {
	makeElement: <T = HTMLElement, P = Record<string, unknown> | string>(
		tagName: string,
		className?: string | null,
		innerText?: string | null,
		props?: P,
		is?: componentName
	) => {
		const element = document.createElement(tagName, { is });
		if (is) element.setAttribute('is', is);
		if (className)
			className.split(' ').forEach((c) => {
				if (c.length) element.classList.add(c);
			});
		if (innerText) element.innerText = innerText;
		if (props) (<any>element).props = props;

		return element as T;
	},

	makeSymbolSpan: (text: string) =>
		yafElement.makeElement('span', 'symbol', text),
	makeNameSpan: (text: string) =>
		yafElement.makeElement('span', 'name', text),
	makeTypeSpan: (text: string) =>
		yafElement.makeElement('span', 'type', text),
	makeTitleSpan: (text: string) =>
		yafElement.makeElement('span', 'title', text),
	makeKindSpan: (text: string) =>
		yafElement.makeElement('span', 'kind', text),
	makeValueSpan: (text: string) =>
		yafElement.makeElement('span', 'value', text),
	makeParametersSpan: (text: string) =>
		yafElement.makeElement('span', 'parameters', text),

	makeLiteralSpan: (text: string) =>
		yafElement.makeElement('span', 'literal', text),

	makeIconSpan: (
		iconInnerHtml: materialIcon,
		size: 18 | 24 | 36 | 48 = 24
	): Element => {
		return yafElement.makeElement(
			'span',
			`${iconClass} md-${size} yaficon`,
			iconInnerHtml
		);
	},
	makeLinkElement: (href: string, className?: string, innerText?: string) => {
		const link = yafElement.makeElement<YafNavigationLink>(
			'a',
			className,
			innerText,
			undefined,
			'yaf-navigation-link'
		);
		link.setAttribute('href', href);
		return link;
	},
	makeFlags(
		flags: JSONOutput.ReflectionFlags,
		comment: JSONOutput.Comment | undefined
	) {
		const normalisedFlags = yafElement.normaliseFlags(flags);
		const flagElement = yafElement.makeElement<
			YafWidgetFlags,
			YafWidgetFlags['props']
		>('yaf-widget-flags', null, null, {
			flags: normalisedFlags,
			comment,
		});
		return flagElement;
	},
	/**
	 * Converts a ReflectionFlags Record object into an array of flags
	 * @param flags
	 * @returns
	 */
	normaliseFlags: (flags: JSONOutput.ReflectionFlags) => {
		const flagsArray = Object.keys(flags)
			.map((flag) =>
				flag.replace('is', '').replace('has', '').toLowerCase().trim()
			)
			.filter((flag) => !!flag);

		return flagsArray;
	},

	getHtmlTemplate: (id: componentName) => {
		const template = <HTMLTemplateElement>document.getElementById(id);
		return template
			? template.content
			: errorHandlers.notFound(
					`Could not find the HTMLTemplate for "#${id}".`
			  );
	},

	needsParenthesis: (element: HTMLElement) => {
		return element.hasAttribute('needsParenthesis');
	},

	renderSignatureType: (
		type: YAFDataObject['type'],
		context: TypeContext
	) => {
		if (!type) return yafElement.makeElement('span', null, 'null');
		return yafElement.makeElement<YafSignature, YafSignature['props']>(
			'yaf-signature',
			null,
			null,
			{
				type,
				context,
			}
		);
	},

	initCap: (text: string) =>
		`${text.charAt(0).toUpperCase()}${text.slice(1)}`,

	debounce: (self: Record<string, unknown>) => {
		if (self.debounceCount) {
			//console.debug(`${self.constructor.name} was debounced`);
			return true;
		}
		!self.debounceCount
			? (self.debounceCount = 1)
			: (<number>self.debounceCount)++;
		return false;
	},

	getTransitionDuration: (drawer: HTMLElement) => {
		const animationDelay = getComputedStyle(drawer).getPropertyValue(
			'transition-duration'
		);
		return parseFloat(animationDelay) * 1000;
	},

	scrollToAnchor: (container: HTMLElement, anchor: string | number) => {
		if (typeof anchor === 'number') return container.scrollTo(0, 0);

		const targetElement = document.getElementById(anchor);
		if (targetElement) {
			const drawerParents =
				YafElementDrawers.findParentDrawers(targetElement);

			if (!YafElementDrawers.hasClosedDrawers(drawerParents)) {
				targetElement.scrollIntoView({ behavior: 'smooth' });
				yafElement.flashElementBackground(targetElement);
			} else if (drawerParents.length) {
				drawerParents.forEach((element) =>
					element.drawers.openDrawer()
				);
				setTimeout(() => {
					targetElement.scrollIntoView({ behavior: 'smooth' });
					yafElement.flashElementBackground(targetElement);
				}, yafElement.getTransitionDuration(drawerParents[0].drawers.drawer) / 2);
			}
		} else {
			return errorHandlers.notFound(
				`Could not find element for "#${anchor}"`
			);
		}
	},
	flashElementBackground: (element: HTMLElement) => {
		element.classList.add('flash');
		setTimeout(() => element.classList.remove('flash'), 1000);
	},
	stringify(value: unknown) {
		if (typeof value === 'bigint') {
			return String(value) + 'n';
		}
		return JSON.stringify(value);
	},
};

export default yafElement;
