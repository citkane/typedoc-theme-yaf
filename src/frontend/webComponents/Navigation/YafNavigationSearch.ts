import { componentName, yafEventList } from '../../../types/frontendTypes.js';
import { action, events } from '../../handlers/index.js';
import { makeElement } from '../../yafElement.js';
import YafHTMLElement from '../../YafHTMLElement.js';

const { trigger, action } = events;

/**
 *
 */
export class YafNavigationSearch extends YafHTMLElement {
	resultsHTMLElement = makeElement('ul', 'results');
	onConnect() {
		this.eventsList.forEach((event) => events.on(...event));

		this.appendChild(this.resultsHTMLElement);
	}
	disconnectedCallback() {
		this.eventsList.forEach((event) => events.off(...event));
	}
	private search = ({ detail }: CustomEvent<action['menu']['search']>) => {
		console.log(detail.searchString);
		this.resultsHTMLElement.innerText = detail.searchString;
	};
	private eventsList: yafEventList = [[trigger.menu.search, this.search]];
}
const yafNavigationSearch: componentName = 'yaf-navigation-search';
customElements.define(yafNavigationSearch, YafNavigationSearch);
