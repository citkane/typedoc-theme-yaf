import { yafTypeArgumentsProps } from '../../../types/frontendTypes.js';
import { YafHTMLElement } from '../../index.js';
import { makeSymbolSpan, makeElement } from '../../yafElement.js';
import { YafSignature } from '../Signature/YafSignature.js';

export class YafTypeArguments extends YafHTMLElement<yafTypeArgumentsProps> {
	onConnect() {
		const { args } = this.props;
		const { factory } = YafTypeArguments;
		if (!args || !args.length) return;

		const HTMLElements = [
			makeSymbolSpan('<'),
			factory.mapArguments(args),
			makeSymbolSpan('>'),
		].flat();

		this.appendChildren(HTMLElements);
	}

	private static factory = {
		mapArguments: (args: yafTypeArgumentsProps['args'] = []) =>
			args
				.map((argument, i) => {
					const signature = makeElement<
						YafSignature,
						YafSignature['props']
					>('yaf-signature', null, null, {
						type: argument,
						context: 'referenceTypeArgument',
					});
					if (i >= args.length - 1) return signature;
					return [signature, makeSymbolSpan(', ')];
				})
				.flat(),
	};
}
const yafTypeArguments = 'yaf-type-arguments';
customElements.define(yafTypeArguments, YafTypeArguments);
