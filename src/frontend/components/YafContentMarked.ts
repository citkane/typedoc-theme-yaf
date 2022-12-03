/**
 *
 */
import { componentName } from '../../types/frontendTypes.js';
import { htmlString } from '../../types/types.js';

export class YafContentMarked extends HTMLElement {
	props!: htmlString | undefined;

	async connectedCallback() {
		if (!this.props) return;
		this.classList.add('markdown-body');
		this.innerHTML = this.props;
	}
}

const yafContentMarked: componentName = 'yaf-content-marked';
customElements.define(yafContentMarked, YafContentMarked);
