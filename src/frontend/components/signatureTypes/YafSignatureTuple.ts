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
		this.appendChild(this.makeSpan('[', 'symbol'));
		elements?.forEach((type, i) => {
			const signature: YafSignature =
				this.makeElement('<yaf-signature />');
			signature.props = { type, context: 'tupleElement' };
			this.appendChild(signature);
			if (i < elements.length - 1)
				this.appendChild(this.makeSpan(', ', 'symbol'));
		});
		this.appendChild(this.makeSpan(']', 'symbol'));
	}
}

const yafSignatureTuple = 'yaf-signature-tuple';
customElements.define(yafSignatureTuple, YafSignatureTuple);
