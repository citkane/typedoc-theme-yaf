import { JSONOutput } from 'typedoc';
import yafElement from '../../../YafElement.js';
import { YafSignature } from '../YafSignature.js';

export class YafSignatureTuple extends HTMLElement {
	props!: JSONOutput.TupleType;

	connectedCallback() {
		if (yafElement.debounce(this as Record<string, unknown>)) return;

		const { elements } = this.props;
		this.appendChild(yafElement.makeSymbolSpan('['));
		elements?.forEach((type, i) => {
			const signature =
				yafElement.makeElement<YafSignature>('yaf-signature');
			signature.props = { type, context: 'tupleElement' };

			this.appendChild(signature);

			if (i < elements.length - 1)
				this.appendChild(yafElement.makeSymbolSpan(', '));
		});
		this.appendChild(yafElement.makeSymbolSpan(']'));
	}
}

const yafSignatureTuple = 'yaf-signature-tuple';
customElements.define(yafSignatureTuple, YafSignatureTuple);
