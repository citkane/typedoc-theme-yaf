import { JSONOutput } from 'typedoc';
import yafElement from '../YafElement.js';
import { YafSignature } from './YafSignature.js';

export * from './signatureTypes/index.js';

export class YafTypeArguments extends HTMLElement {
	props!: {
		args: JSONOutput.ReferenceType['typeArguments'];
		context: string;
	};
	connectedCallback() {
		if (yafElement.debounce(this as Record<string, unknown>)) return;

		const { args } = this.props;
		if (!args || !args.length) return;
		this.appendChild(yafElement.makeSymbolSpan('<'));
		args.forEach((argument, i) => {
			const signature: YafSignature =
				yafElement.makeElement('yaf-signature');
			signature.props = {
				type: argument,
				context: 'referenceTypeArgument',
			};
			this.appendChild(signature);
			if (i < args!.length - 1)
				this.appendChild(yafElement.makeSymbolSpan(', '));
		});
		this.appendChild(yafElement.makeSymbolSpan('>'));
	}
}
const yafTypeArguments = 'yaf-type-arguments';
customElements.define(yafTypeArguments, YafTypeArguments);
