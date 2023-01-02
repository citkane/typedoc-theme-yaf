/**
 *
 */
import { componentName } from '../../../types/frontendTypes.js';
import { htmlString } from '../../../types/types.js';
import { YafHTMLElement } from '../../index.js';
import { makeLinkElement } from '../../yafElement.js';

export class YafContentMarked extends YafHTMLElement<htmlString | undefined> {
	onConnect() {
		this.classList.add('markdown-body');
		this.innerHTML = this.props || '';
		const HTMLLinks = this.querySelectorAll('a');

		HTMLLinks.forEach((link) => {
			const href = link.getAttribute('href');
			if (!href || href.startsWith('#')) return;

			const yafLink = makeLinkElement(href);
			yafLink.innerHTML = link.innerHTML;
			link.parentElement?.replaceChild(yafLink, link);
		});
	}
}

const yafContentMarked: componentName = 'yaf-content-marked';
customElements.define(yafContentMarked, YafContentMarked);
