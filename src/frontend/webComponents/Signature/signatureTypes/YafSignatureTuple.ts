import { JSONOutput } from 'typedoc';
import { makeSymbolSpan, renderSignatureType } from '../../../yafElement.js';
import { YafHTMLElement } from '../../../index.js';
import { componentName } from '../../../../types/frontendTypes.js';

export class YafSignatureTuple extends YafHTMLElement<JSONOutput.TupleType> {
	onConnect() {
		const { elements: tupleTypes } = this.props;
		const { factory } = YafSignatureTuple;

		const HTMLElements = [
			makeSymbolSpan('['),
			factory.tupleTypes(tupleTypes),
			makeSymbolSpan(']'),
		];

		this.appendChildren(HTMLElements.flat());
	}

	private static factory = {
		tupleTypes: (tupleTypes: JSONOutput.TupleType['elements']) =>
			tupleTypes
				?.map((type, i) => [
					renderSignatureType(type, 'tupleElement'),
					i < tupleTypes.length - 1
						? makeSymbolSpan(', ')
						: undefined,
				])
				.flat(),
	};
}

const yafSignatureTuple: componentName = 'yaf-signature-tuple';
customElements.define(yafSignatureTuple, YafSignatureTuple);
