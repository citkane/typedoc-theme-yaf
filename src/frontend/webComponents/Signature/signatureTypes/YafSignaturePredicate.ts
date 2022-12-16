import { JSONOutput } from 'typedoc';
import { debouncer } from '../../../../types/frontendTypes.js';
import yafElement from '../../../yafElement.js';
const { debounce, makeSymbolSpan, makeNameSpan, renderSignatureType } =
	yafElement;

export class YafSignaturePredicate extends HTMLElement {
	props!: JSONOutput.PredicateType;

	connectedCallback() {
		if (debounce(this as debouncer)) return;

		const { name, asserts, targetType } = this.props;
		const HTMLElements = [
			asserts ? makeSymbolSpan('asserts ') : undefined,
			makeNameSpan(name),
			targetType
				? [
						makeSymbolSpan(' is '),
						renderSignatureType(targetType, 'predicateTarget'),
				  ]
				: undefined,
		]
			.filter((element) => !!element)
			.flat();

		HTMLElements.forEach((element) => this.appendChild(element!));
	}
}

const yafSignaturePredicate = 'yaf-signature-predicate';
customElements.define(yafSignaturePredicate, YafSignaturePredicate);
