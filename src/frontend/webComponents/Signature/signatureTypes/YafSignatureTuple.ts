import { debouncer } from '../../../../types/frontendTypes.js';
import { JSONOutput } from 'typedoc';
import yafElement from '../../../yafElement.js';
const { debounce, makeSymbolSpan, renderSignatureType } = yafElement;

export class YafSignatureTuple extends HTMLElement {
	props!: JSONOutput.TupleType;

	connectedCallback() {
		if (debounce(this as debouncer)) return;

		const { elements: tupleTypes } = this.props;
		const HTMLElements = [makeSymbolSpan('[')];

		tupleTypes?.forEach((type, i) => {
			HTMLElements.push(renderSignatureType(type, 'tupleElement'));
			if (i >= tupleTypes.length - 1) return;
			HTMLElements.push(makeSymbolSpan(', '));
		});
		HTMLElements.push(makeSymbolSpan(']'));

		HTMLElements.forEach((element) => this.appendChild(element));
	}
}

const yafSignatureTuple = 'yaf-signature-tuple';
customElements.define(yafSignatureTuple, YafSignatureTuple);
