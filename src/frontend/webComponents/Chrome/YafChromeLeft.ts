import { componentName, yafEventList } from '../../../types/frontendTypes.js';
import { YafHTMLElement } from '../../index.js';
import { getHtmlTemplate } from '../../yafElement.js';
import { action, events } from '../../handlers/index.js';
const { trigger, action } = events;

/**
 *
 */
export class YafChromeLeft extends YafHTMLElement {
	onConnect() {
		this.appendChild(getHtmlTemplate(yafChromeLeft));

		this.eventsList.forEach((event) => events.on(...event));
	}

	disconnectedCallback() {
		this.eventsList.forEach((event) => events.off(...event));
	}

	private toggleSearch = ({
		detail,
	}: CustomEvent<action['menu']['search']>) => {
		const { searchString } = detail;
		searchString.length >= 3
			? this.classList.add('activeSearch')
			: this.classList.remove('activeSearch');
	};

	private eventsList: yafEventList = [
		[trigger.menu.search, this.toggleSearch],
	];
}
const yafChromeLeft: componentName = 'yaf-chrome-left';
customElements.define(yafChromeLeft, YafChromeLeft);
