import { componentName, debouncer } from '../../../types/frontendTypes.js';
import yafElement from '../../yafElement.js';
const { debounce, getHtmlTemplate } = yafElement;

/**
 *
 */
export class YafChromeLeft extends HTMLElement {
	connectedCallback() {
		if (debounce(this as debouncer)) return;

		this.appendChild(getHtmlTemplate(yafChromeLeft));
	}
}
const yafChromeLeft: componentName = 'yaf-chrome-left';
customElements.define(yafChromeLeft, YafChromeLeft);
