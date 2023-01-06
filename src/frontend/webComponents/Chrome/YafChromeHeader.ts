import { componentName, yafEventList } from '../../../types/frontendTypes.js';
import { YafHTMLElement } from '../../index.js';

import { events, action, appState } from '../../handlers/index.js';
import { makeElement, makeLinkElement } from '../../yafElement.js';
const { trigger } = events;

/**
 * **The app chrome wrapping around the main content portal.**
 *
 * This component deals primarily with opening drawers and scrolling to content.\
 * It reacts to location input events.
 */
export class YafChromeHeader extends YafHTMLElement {
	breadcrumbHTMLElement!: HTMLElement;
	onConnect() {
		this.eventsList.forEach((event) => events.on(...event));
		this.breadcrumbHTMLElement = makeElement('span');
		this.breadcrumbHTMLElement.id = 'breadcrumb';
		this.appendChild(this.breadcrumbHTMLElement);
	}
	disconnectedCallback() {
		this.eventsList.forEach((event) => events.off(...event));
	}

	private makeBreadcrumb = ({
		detail,
	}: CustomEvent<action['content']['breadcrumb']>) => {
		const breadcrumbs = appState.getBreadcrumb(detail.id);
		const breadcrumbHTMLElements = breadcrumbs
			.map((id, i) => {
				const link = appState.reflectionMap[id];
				const linkHTMLElement = makeLinkElement(
					`?page=${link.query}`,
					undefined,
					link.name
				);
				return i < breadcrumbs.length - 1
					? [linkHTMLElement, makeElement('span', 'divider', '>')]
					: linkHTMLElement;
			})
			.flat();
		this.breadcrumbHTMLElement.replaceChildren(...breadcrumbHTMLElements);
	};

	eventsList: yafEventList = [
		[trigger.content.breadcrumb, this.makeBreadcrumb],
	];
}

const yafChromeHeader: componentName = 'yaf-chrome-header';
customElements.define(yafChromeHeader, YafChromeHeader);
