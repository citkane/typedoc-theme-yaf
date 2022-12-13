import { componentName } from '../../../types/frontendTypes.js';
import yafElement from '../../YafElement.js';
import events from '../../lib/events/eventApi.js';

const { trigger } = events;

/**
 * **The app chrome wrapping around the main content portal.**
 *
 * This component deals primarily with opening drawers and scrolling to content.\
 * It reacts to location input events.
 */
export class YafChromeContent extends HTMLElement {
	connectedCallback() {
		events.on(trigger.content.scrollTo, this.focusContent);
		this.appendChild(yafElement.getHtmlTemplate(yafChromeContent));
	}

	disconnectedCallback() {
		events.off(trigger.content.scrollTo, this.focusContent);
	}

	focusContent = ({ detail }: CustomEvent) =>
		yafElement.scrollToAnchor(this, detail.target);
}

const yafChromeContent: componentName = 'yaf-chrome-content';
customElements.define(yafChromeContent, YafChromeContent);

/**
 *
 */
export class YafChromeLeft extends HTMLElement {
	connectedCallback() {
		this.appendChild(yafElement.getHtmlTemplate(yafChromeLeft));
	}
}
const yafChromeLeft: componentName = 'yaf-chrome-left';
customElements.define(yafChromeLeft, YafChromeLeft);
