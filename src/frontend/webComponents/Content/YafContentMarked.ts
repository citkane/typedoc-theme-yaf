/**
 *
 */
import { componentName, debouncer } from '../../../types/frontendTypes.js';
import { htmlString } from '../../../types/types.js';
import yafElement from '../../yafElement.js';
const { debounce } = yafElement;

export class YafContentMarked extends HTMLElement {
	props!: htmlString | undefined;

	connectedCallback() {
		if (!this.props || debounce(this as debouncer)) return;

		this.classList.add('markdown-body');
		this.innerHTML = this.props;
	}
}

const yafContentMarked: componentName = 'yaf-content-marked';
customElements.define(yafContentMarked, YafContentMarked);
