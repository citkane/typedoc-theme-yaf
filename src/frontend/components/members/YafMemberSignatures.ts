import { YafSignatureReflection } from '../../../types/types.js';
import yafElement from '../../YafElement.js';
import { YafFlags } from '../YafFlags.js';
import { YafSignatureBody } from '../YafSignatureBody.js';
import { YafSignatureTitle } from '../YafSignatureTitle.js';

export class YafMemberSignatures extends HTMLElement {
	props!: YafSignatureReflection[];

	connectedCallback() {
		if (yafElement.debounce(this as Record<string, unknown>)) return;

		this.props?.forEach((signature) => {
			const { flags, comment } = signature;

			if (this.props.length > 1) {
				const flagsElement: YafFlags =
					yafElement.makeElement('yaf-flags');
				flagsElement.props = { flags, comment };
				this.appendChild(flagsElement);
			}

			const pre = yafElement.makeElement('pre', 'highlight');
			const title = yafElement.makeElement<YafSignatureTitle>(
				'yaf-signature-title'
			);
			title.props = signature;
			pre.appendChild(title);
			this.appendChild(pre);

			const body =
				yafElement.makeElement<YafSignatureBody>('yaf-signature-body');
			body.props = signature as YafSignatureReflection;
			this.appendChild(body);
		});
	}
}

const yafMemberSignatures = 'yaf-member-signatures';
customElements.define(yafMemberSignatures, YafMemberSignatures);
