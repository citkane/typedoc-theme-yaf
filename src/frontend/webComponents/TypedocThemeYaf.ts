import { componentName, yafEventList } from '../../types/frontendTypes.js';
import { getHtmlTemplate } from '../yafElement.js';
import appState from '../handlers/AppState.js';
import { YafHTMLElement } from '../index.js';
import { action, events } from '../handlers/index.js';

const { trigger } = events;

/**
 * This is the highest level component of the theme, parent container to all other custom theme elements
 */
export class TypedocThemeYaf extends YafHTMLElement {
	onConnect() {
		appState
			.initCache()
			.then(() => this.appendChild(getHtmlTemplate(typedocThemeYaf)));
		this.events.forEach((event) => events.on(...event));
	}
	disconnectedCallback() {
		this.events.forEach((event) => events.off(...event));
	}
	private toggleMenu = ({
		detail,
	}: CustomEvent<action['menu']['toggle']>) => {
		const { state } = detail;
		if (state === 'close' || this.classList.contains('menuOpen')) {
			this.classList.remove('menuOpen');
		} else {
			this.classList.add('menuOpen');
		}
	};
	private events: yafEventList = [[trigger.menu.toggle, this.toggleMenu]];
}
const typedocThemeYaf: componentName = 'typedoc-theme-yaf';
customElements.define(typedocThemeYaf, TypedocThemeYaf);
