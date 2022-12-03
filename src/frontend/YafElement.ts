import { YAFDataObject } from '../types/types.js';
import {
	abnormalSigTypes,
	componentName,
	materialIcon,
	TypeContext,
} from '../types/frontendTypes.js';
import { YafSignature } from './components/YafSignature.js';
import errorHandlers from './lib/ErrorHandlers.js';
import { YafNavigationLink } from './components/YafNavigationLink.js';
import { JSONOutput } from 'typedoc';
import { YafFlags } from './components/YafFlags.js';
import YafElementDrawers from './YafElementDrawers.js';
import ErrorHandlers from './lib/ErrorHandlers.js';

const iconClass = 'material-icons-sharp';

/**
 * The base library upon which all typedoc-theme-yaf web components are built.
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
		const element = is
			? document.createElement(tagName, { is })
			: document.createElement(tagName);
		if (className)
			className.split(' ').forEach((c) => element.classList.add(c));
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
		const flagElement = yafElement.makeElement<YafFlags, YafFlags['props']>(
			'yaf-flags',
			null,
			null,
			{
				flags,
				comment,
			}
		);
		return flagElement;
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
		type: YAFDataObject['type'] | abnormalSigTypes,
		context: TypeContext
	) => {
		if (!type) return yafElement.makeElement('span', null, 'value');
		const signature = yafElement.makeElement<YafSignature>('yaf-signature');
		signature.props = {
			type,
			context,
		};
		return signature;
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
			} else if (drawerParents.length) {
				drawerParents.forEach((element) =>
					element.drawers.openDrawer()
				);
				setTimeout(
					() => targetElement.scrollIntoView({ behavior: 'smooth' }),
					yafElement.getTransitionDuration(
						drawerParents[0].drawers.drawer
					) / 2
				);
			}
		} else {
			return ErrorHandlers.notFound(
				`Could not find element for "#${anchor}"`
			);
		}
	},
};

export default yafElement;
