import { JSONOutput } from 'typedoc';
import { debouncer } from '../../../../types/frontendTypes.js';
import yafElement from '../../../yafElement.js';
const { debounce, makeSymbolSpan, makeTypeSpan, renderSignatureType } =
	yafElement;

export class YafSignatureInferred extends HTMLElement {
	props!: JSONOutput.InferredType;

	connectedCallback() {
		if (debounce(this as debouncer)) return;

		const { name, constraint } = this.props;
		const HTMLElements = [makeSymbolSpan('infer '), makeTypeSpan(name)];

		if (constraint) {
			HTMLElements.push(makeSymbolSpan(' extends '));
			HTMLElements.push(
				renderSignatureType(constraint, 'inferredConstraint')
			);
		}

		HTMLElements.forEach((element) => this.appendChild(element));
	}
}

const yafSignatureinferred = 'yaf-signature-inferred';
customElements.define(yafSignatureinferred, YafSignatureInferred);
