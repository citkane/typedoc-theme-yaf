import {
	componentName,
	materialIcon,
	TypeContext,
	yafHTMLExtension,
} from '../types/frontendTypes.js';

import { JSONOutput } from 'typedoc';
import { YAFDataObject } from '../types/types';
import { YafNavigationLink } from './webComponents/Navigation/index.js';
import { YafSignature } from './webComponents/Signature/index.js';

import errorHandlers from './handlers/ErrorHandlers.js';
import YafElementDrawers from './YafElementDrawers.js';
import { YafWidgetFlags } from './webComponents/Widget/index.js';

const iconClass = 'material-icons-sharp';

export const appendChildren =
	(element: HTMLElement): yafHTMLExtension['appendChildren'] =>
	(children = []) => {
		children.forEach((child) => {
			if (child) element.appendChild(child);
		});
	};

export const makeElement = <
	T = HTMLElement,
	P = Record<string, unknown> | string
>(
	tagName: string,
	className?: string | null,
	innerText?: string | null,
	props?: P
) => {
	const element = document.createElement(tagName);
	if (className)
		className.split(' ').forEach((c) => {
			if (c.length) element.classList.add(c);
		});
	if (innerText) element.innerText = innerText;
	(<HTMLElement & yafHTMLExtension>element).props = props ? props : {};
	(<HTMLElement & yafHTMLExtension>element).appendChildren =
		appendChildren(element);

	return element as T & yafHTMLExtension;
};

export const makeSymbolSpan = (text: string) =>
	makeElement('span', 'symbol', text);

export const makeNameSpan = (text: string) => makeElement('span', 'name', text);

export const makeTypeSpan = (text: string) => makeElement('span', 'type', text);

export const makeTitleSpan = (text: string) =>
	makeElement('span', 'title', text);

export const makeParameterSpan = (text: string) =>
	makeElement('span', 'parameter', text);

export const makeIntrinsicSpan = (text: string) =>
	makeElement('span', 'intrinsic', text);

export const makeKindSpan = (text: string) => makeElement('span', 'kind', text);

export const makeValueSpan = (text: string) =>
	makeElement('span', 'value', text);

export const makeParametersSpan = (text: string) =>
	makeElement('span', 'parameters', text);

export const makeLiteralSpan = (text: string) =>
	makeElement('span', 'literal', text);

export const makeIconSpan = (
	iconInnerHtml: materialIcon,
	size: 18 | 24 | 36 | 48 = 24
): HTMLElement => {
	return makeElement(
		'span',
		`${iconClass} md-${size} yaficon`,
		iconInnerHtml
	);
};

export const makeLinkElement = (
	href: string,
	className?: string,
	innerText?: string
) => {
	const link = makeElement<YafNavigationLink>(
		'yaf-navigation-link',
		className,
		innerText,
		undefined
	);
	link.setAttribute('href', href);
	return link;
};

export const makeFlags = (
	flags: JSONOutput.ReflectionFlags,
	comment: JSONOutput.Comment | undefined
) => {
	const normalisedFlags = normaliseFlags(flags);
	const flagElement = makeElement<YafWidgetFlags, YafWidgetFlags['props']>(
		'yaf-widget-flags',
		null,
		null,
		{
			flags: normalisedFlags,
			comment,
		}
	);
	return flagElement;
};

/**
 * Converts a ReflectionFlags Record object into an array of flags
 * @param flags
 * @returns
 */
export const normaliseFlags = (
	flags: JSONOutput.ReflectionFlags | undefined
) => {
	if (!flags) return [];
	const flagsArray = Object.keys(flags)
		.map((flag) =>
			flag.replace('is', '').replace('has', '').toLowerCase().trim()
		)
		.filter((flag) => !!flag);

	return flagsArray;
};

/**
 * Fetches the given document template from `index.html`.
 * @param id The DOM id of the template
 * @returns
 */
export const getHtmlTemplate = (id: componentName) => {
	const template = <HTMLTemplateElement>document.getElementById(id);
	return template
		? template.content
		: errorHandlers.notFound(
				`Could not find the HTMLTemplate for "#${id}".`
		  );
};

export const needsParenthesis = (element: HTMLElement) => {
	return element.hasAttribute('needsParenthesis');
};

export const renderSignatureType = (
	type: YAFDataObject['type'],
	context: TypeContext
) => {
	if (!type) return makeElement('span', null, 'null');
	return makeElement<YafSignature, YafSignature['props']>(
		'yaf-signature',
		null,
		null,
		{
			type,
			context,
		}
	);
};

export const initCap = (text: string) =>
	`${text.charAt(0).toUpperCase()}${text.slice(1)}`;

export const getTransitionDuration = (drawer: HTMLElement) => {
	const animationDelay = getComputedStyle(drawer).getPropertyValue(
		'transition-duration'
	);
	return parseFloat(animationDelay) * 1000;
};

export const scrollToAnchor = (
	container: HTMLElement,
	anchor: string | number
) => {
	if (typeof anchor === 'number') return (container.scrollTop = 0);

	const targetElement = document.getElementById(anchor);
	if (targetElement) {
		const drawerParents =
			YafElementDrawers.findParentDrawers(targetElement);

		if (!YafElementDrawers.hasClosedDrawers(drawerParents)) {
			targetElement.scrollIntoView({
				behavior: 'smooth',
				block: 'start',
			});
			hackFixMobileScrolling();
			flashElementBackground(targetElement);
		} else if (drawerParents.length) {
			drawerParents.forEach((element) => element.drawers.openDrawer());
			setTimeout(() => {
				targetElement.scrollIntoView({
					behavior: 'smooth',
					block: 'start',
				});
				hackFixMobileScrolling();
				flashElementBackground(targetElement);
			}, getTransitionDuration(drawerParents[0].drawers.drawer) / 2);
		}
	} else {
		return errorHandlers.notFound(
			`Could not find element for "#${anchor}"`
		);
	}
	function hackFixMobileScrolling() {
		const containerHTMLElements = document.querySelectorAll(
			'html, body, typedoc-theme-yaf, yaf-chrome-left, yaf-chrome-right'
		);
		[...containerHTMLElements].forEach((containerHTMLElement) => {
			if (containerHTMLElement) containerHTMLElement.scrollTop = 0;
		});
	}
};

export const flashElementBackground = (element: HTMLElement) => {
	element.classList.add('flash');
	setTimeout(() => element.classList.remove('flash'), 1000);
};

export const stringify = (value: unknown) => {
	if (typeof value === 'bigint') {
		return String(value) + 'n';
	}
	return JSON.stringify(value).replace(/^"|"$/g, '');
};
