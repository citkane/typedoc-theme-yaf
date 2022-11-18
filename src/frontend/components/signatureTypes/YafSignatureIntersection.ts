import { JSONOutput } from 'typedoc';
import { YafElement } from '../../YafElement.js';

export class YafSignatureIntersection extends YafElement {
	props!: JSONOutput.IntersectionType;
	constructor() {
		super(yafSignatureIntersection);
	}
	connectedCallback() {
		if (this.debounce()) return;
		console.log(this.props);
	}
}

const yafSignatureIntersection = 'yaf-signature-intersection';
customElements.define(yafSignatureIntersection, YafSignatureIntersection);
