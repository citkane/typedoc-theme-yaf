import {
	componentName,
	debouncer,
	yafEventList,
} from '../../../types/frontendTypes.js';
import events from '../../lib/events/eventApi.js';
import yafElement from '../../yafElement.js';
const { debounce, getHtmlTemplate, scrollToAnchor } = yafElement;

const { trigger } = events;

/**
 * **The app chrome wrapping around the main content portal.**
 *
 * This component deals primarily with opening drawers and scrolling to content.\
 * It reacts to location input events.
 */
export class YafChromeContent extends HTMLElement {
	connectedCallback() {
		if (debounce(this as debouncer)) return;
		this.events.forEach((event) => events.on(...event));
		this.appendChild(getHtmlTemplate(yafChromeContent));
	}

	disconnectedCallback() {
		this.events.forEach((event) => events.off(...event));
	}

	private focusContent = ({ detail }: CustomEvent) =>
		scrollToAnchor(this, detail.target);

	private events: yafEventList = [
		[trigger.content.scrollTo, this.focusContent],
	];
}

const yafChromeContent: componentName = 'yaf-chrome-content';
customElements.define(yafChromeContent, YafChromeContent);
