import { debouncer } from '../../../../types/frontendTypes.js';
import { JSONOutput } from 'typedoc';
import yafElement from '../../../yafElement.js';
const { debounce, makeNameSpan, makeSymbolSpan, renderSignatureType } =
	yafElement;

export class YafSignatureNamedTupleMember extends HTMLElement {
	props!: JSONOutput.NamedTupleMemberType;

	connectedCallback() {
		if (debounce(this as debouncer)) return;

		const { name, isOptional, element } = this.props;
		const HTMLElements = [
			makeNameSpan(name),
			makeSymbolSpan(isOptional ? '?:' : ':'),
			renderSignatureType(element, 'tupleElement'),
		];

		HTMLElements.forEach((element) => this.appendChild(element));
	}
}

const yafSignatureNamedTupleMember = 'yaf-signature-named-tuple-member';
customElements.define(
	yafSignatureNamedTupleMember,
	YafSignatureNamedTupleMember
);
