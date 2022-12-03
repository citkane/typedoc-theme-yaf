import { JSONOutput } from 'typedoc';
import yafElement from '../../YafElement.js';

export class YafSignatureIntersection extends HTMLElement {
	props!: JSONOutput.IntersectionType;

	connectedCallback() {
		if (yafElement.debounce(this as Record<string, unknown>)) return;
		console.log(this.props);
	}
}

const yafSignatureIntersection = 'yaf-signature-intersection';
customElements.define(yafSignatureIntersection, YafSignatureIntersection);
