import { JSONOutput } from 'typedoc';
import { YafElement } from '../../YafElement.js';
import { YafSignature } from '../YafSignature.js';

export class YafSignatureNamedTupleMember extends YafElement {
	props!: JSONOutput.NamedTupleMemberType;
	constructor() {
		super(yafSignatureNamedTupleMember);
	}
	connectedCallback() {
		if (this.debounce()) return;

		const { name, isOptional, element } = this.props;
		this.appendChild(this.makeNameSpan(name));
		this.appendChild(this.makeSymbolSpan(isOptional ? '?:' : ':'));
		const signature = this.makeElement<YafSignature>('yaf-signature');
		signature.props = { type: element, context: 'tupleElement' };

		this.appendChild(signature);
	}
}

const yafSignatureNamedTupleMember = 'yaf-signature-named-tuple-member';
customElements.define(
	yafSignatureNamedTupleMember,
	YafSignatureNamedTupleMember
);
