/**
 *
 */
import { componentName } from '../../../types/frontendTypes.js';
import { htmlString } from '../../../types/types.js';
import { YafHTMLElement } from '../../index.js';

export class YafContentMarked extends YafHTMLElement<htmlString | undefined> {
	onConnect() {
		this.classList.add('markdown-body');
		this.innerHTML = this.props || '';
	}
}

const yafContentMarked: componentName = 'yaf-content-marked';
customElements.define(yafContentMarked, YafContentMarked);
