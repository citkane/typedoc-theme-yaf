import { YafSignatureReflection } from '../../../types/types.js';
import yafElement from '../../yafElement.js';
import { YafSignatureBody, YafSignatureTitle } from '../Signature/index.js';

export class YafMemberSignatures extends HTMLElement {
	props!: YafSignatureReflection[];

	connectedCallback() {
		if (yafElement.debounce(this as Record<string, unknown>)) return;

		this.props?.forEach((signature) => {
			const { flags, comment } = signature;

			if (this.props.length > 1) {
				const flagsElement = yafElement.makeFlags(flags, comment);
				this.appendChild(flagsElement);
			}

			const pre = yafElement.makeElement('pre', 'highlight');
			pre.appendChild(
				yafElement.makeElement<
					YafSignatureTitle,
					YafSignatureTitle['props']
				>('yaf-signature-title', null, null, signature)
			);

			this.appendChild(pre);

			const body = yafElement.makeElement<
				YafSignatureBody,
				YafSignatureBody['props']
			>('yaf-signature-body', null, null, signature);

			this.appendChild(body);
		});
	}
}

const yafMemberSignatures = 'yaf-member-signatures';
customElements.define(yafMemberSignatures, YafMemberSignatures);
