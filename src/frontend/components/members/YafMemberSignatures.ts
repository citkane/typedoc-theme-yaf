import { YafSignatureReflection } from '../../types.js';
import { YafElement } from '../../YafElement.js';
import { YafFlags } from '../YafFlags.js';
import { YafSignatureBody } from '../YafSignatureBody.js';
import { YafSignatureTitle } from '../YafSignatureTitle.js';

export class YafMemberSignatures extends YafElement {
	props!: YafSignatureReflection[];

	constructor() {
		super(yafMemberSignatures);
	}

	connectedCallback() {
		if (this.debounce()) return;

		this.props?.forEach((signature) => {
			const { flags, comment } = signature;

			if (this.props.length > 1) {
				const flagsElement: YafFlags =
					this.makeElement('<yaf-flags />');
				flagsElement.props = { flags, comment };
				this.appendChild(flagsElement);
			}

			const pre = this.makeElement('<pre />');
			pre.classList.add('highlight');
			const title: YafSignatureTitle = this.makeElement(
				'<yaf-signature-title />'
			);
			title.props = signature;
			pre.appendChild(title);
			this.appendChild(pre);

			const body: YafSignatureBody = this.makeElement(
				'<yaf-signature-body />'
			);
			body.props = signature as YafSignatureReflection;
			this.appendChild(body);
		});
	}
}

const yafMemberSignatures = 'yaf-member-signatures';
customElements.define(yafMemberSignatures, YafMemberSignatures);
