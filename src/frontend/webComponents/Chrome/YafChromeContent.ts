import { componentName, yafEventList } from '../../../types/frontendTypes.js';
import { YafHTMLElement } from '../../index.js';
import events from '../../handlers/events/eventApi.js';
import { getHtmlTemplate, scrollToAnchor } from '../../yafElement.js';

const { trigger } = events;

/**
 * **The app chrome wrapping around the main content portal.**
 *
 * This component deals primarily with opening drawers and scrolling to content.\
 * It reacts to location input events.
 */
export class YafChromeContent extends YafHTMLElement {
	onConnect() {
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
