import { JSONOutput } from 'typedoc';
import { YafHTMLElement } from '../../../index.js';
import {
	makeSymbolSpan,
	makeNameSpan,
	renderSignatureType,
} from '../../../yafElement.js';

export class YafSignaturePredicate extends YafHTMLElement<JSONOutput.PredicateType> {
	onConnect() {
		const { name, asserts, targetType } = this.props;
		const { factory } = YafSignaturePredicate;

		const HTMLElements = [
			factory.asserts(asserts),
			makeNameSpan(name),
			factory.targetType(targetType),
		];

		this.appendChildren(HTMLElements.flat());
	}

	private static factory = {
		asserts: (asserts: boolean) =>
			asserts ? makeSymbolSpan('asserts ') : undefined,
		targetType: (targetType: JSONOutput.PredicateType['targetType']) =>
			targetType
				? [
						makeSymbolSpan(' is '),
						renderSignatureType(targetType, 'predicateTarget'),
				  ]
				: undefined,
	};
}

const yafSignaturePredicate = 'yaf-signature-predicate';
customElements.define(yafSignaturePredicate, YafSignaturePredicate);
