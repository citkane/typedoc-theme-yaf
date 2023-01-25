import { componentName, yafEventList } from '../../../types/frontendTypes.js';
import { action, appState, events } from '../../handlers/index.js';
import { YafHTMLElement } from '../../index.js';
import { getHtmlTemplate, scrollToAnchor } from '../../yafElement.js';

const { action, trigger } = events;

/**
 * **The app chrome wrapping around the main content portal.**
 *
 * This component deals primarily with opening drawers and scrolling to content.\
 * It reacts to location input events.
 */
export class YafChromeContent extends YafHTMLElement {
	scrollTimer!: ReturnType<typeof setTimeout>;
	onConnect() {
		this.events.forEach((event) => events.on(...event));
		this.appendChild(getHtmlTemplate(yafChromeContent));
	}

	disconnectedCallback() {
		this.events.forEach((event) => events.off(...event));
	}

	private focusContent = ({
		detail,
	}: CustomEvent<action['content']['scrollTo']>) => {
		const { target } = detail;

		isNaN(Number(target))
			? scrollToAnchor(this, detail.target)
			: (this.scrollTop = Number(target));

		events.dispatch(action.menu.toggle('close'));
	};

	private emitScroll = () => {
		if (this.scrollTimer) clearTimeout(this.scrollTimer);
		this.scrollTimer = setTimeout(() => {
			events.dispatch(action.content.scrollTop(this.scrollTop));
		}, 100);
	};
	private events: yafEventList = [
		[trigger.content.scrollTo, this.focusContent],
		['scroll', this.emitScroll, this],
	];
}

const yafChromeContent: componentName = 'yaf-chrome-content';
customElements.define(yafChromeContent, YafChromeContent);
