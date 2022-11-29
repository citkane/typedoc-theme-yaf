import { JSONOutput } from 'typedoc';
import { YafElement } from '../../YafElement.js';
import { YafSignature } from '../YafSignature.js';

export class YafSignatureTuple extends YafElement {
	props!: JSONOutput.TupleType;
	constructor() {
		super(yafSignatureTuple);
	}
	connectedCallback() {
		if (this.debounce()) return;

		const { elements } = this.props;
		this.appendChild(this.makeSymbolSpan('['));
		elements?.forEach((type, i) => {
			const signature = this.makeElement<YafSignature>('yaf-signature');
			signature.props = { type, context: 'tupleElement' };

			this.appendChild(signature);

			if (i < elements.length - 1)
				this.appendChild(this.makeSymbolSpan(', '));
		});
		this.appendChild(this.makeSymbolSpan(']'));
	}
}

const yafSignatureTuple = 'yaf-signature-tuple';
customElements.define(yafSignatureTuple, YafSignatureTuple);
