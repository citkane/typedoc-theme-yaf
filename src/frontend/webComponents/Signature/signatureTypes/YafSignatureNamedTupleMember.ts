import { JSONOutput } from 'typedoc';
import yafElement from '../../../YafElement.js';
import { YafSignature } from '../YafSignature.js';

export class YafSignatureNamedTupleMember extends HTMLElement {
	props!: JSONOutput.NamedTupleMemberType;

	connectedCallback() {
		if (yafElement.debounce(this as Record<string, unknown>)) return;

		const { name, isOptional, element } = this.props;
		this.appendChild(yafElement.makeNameSpan(name));
		this.appendChild(yafElement.makeSymbolSpan(isOptional ? '?:' : ':'));
		const signature = yafElement.makeElement<YafSignature>('yaf-signature');
		signature.props = { type: element, context: 'tupleElement' };

		this.appendChild(signature);
	}
}

const yafSignatureNamedTupleMember = 'yaf-signature-named-tuple-member';
customElements.define(
	yafSignatureNamedTupleMember,
	YafSignatureNamedTupleMember
);
