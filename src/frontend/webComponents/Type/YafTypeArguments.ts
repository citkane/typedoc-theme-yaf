import { yafTypeArgumentsProps } from '../../../types/frontendTypes.js';
import { YafHTMLElement } from '../../index.js';
import { makeSymbolSpan, makeElement } from '../../yafElement.js';
import { YafSignature } from '../Signature/YafSignature.js';

export class YafTypeArguments extends YafHTMLElement<yafTypeArgumentsProps> {
	onConnect() {
		const { args } = this.props;
		if (!args || !args.length) return;

		this.appendChild(makeSymbolSpan('<'));
		args.forEach((argument, i) => {
			const signature: YafSignature = makeElement('yaf-signature');
			signature.props = {
				type: argument,
				context: 'referenceTypeArgument',
			};
			this.appendChild(signature);
			if (i < args!.length - 1) this.appendChild(makeSymbolSpan(', '));
		});

		this.appendChild(makeSymbolSpan('>'));
	}
}
const yafTypeArguments = 'yaf-type-arguments';
customElements.define(yafTypeArguments, YafTypeArguments);
