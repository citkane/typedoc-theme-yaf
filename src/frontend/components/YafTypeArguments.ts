import { JSONOutput } from 'typedoc';
import { YafElement } from '../YafElement.js';
import { YafSignature } from './YafSignature.js';

export * from './signatureTypes/index.js';

export class YafTypeArguments extends YafElement {
	props!: {
		args: JSONOutput.ReferenceType['typeArguments'];
		context: string;
	};
	constructor() {
		super(yafTypeArguments);
	}
	connectedCallback() {
		if (this.debounce()) return;

		const { args } = this.props;
		if (!args || !args.length) return;
		this.appendChild(this.makeSymbolSpan('<'));
		args.forEach((argument, i) => {
			const signature: YafSignature = this.makeElement('yaf-signature');
			signature.props = {
				type: argument,
				context: 'referenceTypeArgument',
			};
			this.appendChild(signature);
			if (i < args!.length - 1)
				this.appendChild(this.makeSymbolSpan(', '));
		});
		this.appendChild(this.makeSymbolSpan('>'));
	}
}
const yafTypeArguments = 'yaf-type-arguments';
customElements.define(yafTypeArguments, YafTypeArguments);
