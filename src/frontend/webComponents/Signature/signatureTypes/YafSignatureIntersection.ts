import { JSONOutput } from 'typedoc';
import { debouncer } from '../../../../types/frontendTypes.js';
import yafElement from '../../../yafElement.js';
const { debounce, renderSignatureType, makeSymbolSpan } = yafElement;

export class YafSignatureIntersection extends HTMLElement {
	props!: JSONOutput.IntersectionType;

	connectedCallback() {
		if (debounce(this as debouncer)) return;

		const { types } = this.props;
		const HTMLElements: HTMLElement[] = [];

		types.forEach((type, i) => {
			HTMLElements.push(renderSignatureType(type, 'intersectionElement'));
			if (i >= types.length - 1) return;
			HTMLElements.push(makeSymbolSpan(' & '));
		});

		HTMLElements.forEach((element) => this.appendChild(element));
	}
}

const yafSignatureIntersection = 'yaf-signature-intersection';
customElements.define(yafSignatureIntersection, YafSignatureIntersection);
