import { componentName, yafEventList } from '../../../types/frontendTypes.js';
import { YafHTMLElement } from '../../index.js';

import { events, action, appState } from '../../handlers/index.js';
import {
	makeElement,
	makeIconSpan,
	makeLinkElement,
} from '../../yafElement.js';
const { trigger, action } = events;

/**
 * **The app chrome wrapping around the main content portal.**
 *
 * This component deals primarily with opening drawers and scrolling to content.\
 * It reacts to location input events.
 */
export class YafChromeHeader extends YafHTMLElement {
	breadcrumbHTMLElement!: HTMLElement;
	onConnect() {
		const context = this.getAttribute('context');

		this.eventsList.forEach((event) => events.on(...event));
		this.breadcrumbHTMLElement = makeElement('span', 'breadcrumb');

		if (context === 'desktop') {
			return this.appendChild(this.breadcrumbHTMLElement);
		}

		const mobileHTMLElement = makeElement('span');
		const openMenuHTMLElement = makeIconSpan('menu', 36);
		const closeMenHTMLElement = makeIconSpan('menu_open', 36);
		const hamburgerHTMLElement = makeElement('span');
		const wrapperHTMLElement = makeElement('span', 'wrapper');

		hamburgerHTMLElement.id = 'hamburger';
		openMenuHTMLElement.classList.add('open');
		closeMenHTMLElement.classList.add('close');
		mobileHTMLElement.id = 'mobileNav';

		[openMenuHTMLElement, closeMenHTMLElement].forEach(
			(menuToggle) => (menuToggle.onclick = this.toggleMenu)
		);

		hamburgerHTMLElement.appendChildren([
			openMenuHTMLElement,
			closeMenHTMLElement,
		]);
		mobileHTMLElement.appendChildren([
			makeLinkElement('/', 'projectHome', appState.projectName),
		]);
		wrapperHTMLElement.appendChildren([
			mobileHTMLElement,
			this.breadcrumbHTMLElement,
		]);
		this.appendChildren([hamburgerHTMLElement, wrapperHTMLElement]);
	}
	disconnectedCallback() {
		this.eventsList.forEach((event) => events.off(...event));
	}

	private toggleMenu = () => events.dispatch(action.menu.toggle());
	private makeBreadcrumb = ({
		detail,
	}: CustomEvent<action['content']['breadcrumb']>) => {
		const breadcrumbs = appState.getBreadcrumb(detail.id);
		if (!breadcrumbs) return this.breadcrumbHTMLElement.replaceChildren();
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
