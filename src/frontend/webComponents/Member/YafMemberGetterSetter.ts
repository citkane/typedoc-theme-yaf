import { YAFDataObject, YafSignatureReflection } from '../../../types/types.js';
import yafElement from '../../yafElement.js';
import { YafSignatureBody, YafSignatureTitle } from '../Signature';

export class YafMemberGetterSetter extends HTMLElement {
	props!: YAFDataObject;

	connectedCallback() {
		if (yafElement.debounce(this as Record<string, unknown>)) return;

		const { getSignature, setSignature } = this.props;
		if (getSignature) {
			const wrapper = yafElement.makeElement('div');
			wrapper.classList.add('wrapper');
			wrapper.appendChild(this.makeSignature('get', getSignature));
			wrapper.appendChild(this.makeBody(getSignature));
			this.appendChild(wrapper);
		}

		if (setSignature) {
			const wrapper = yafElement.makeElement('div');
			wrapper.classList.add('wrapper');
			this.appendChild(this.makeSignature('set', setSignature));
			this.appendChild(this.makeBody(setSignature));
			this.appendChild(wrapper);
		}
	}
	makeSignature = (prefix: string, data: YafSignatureReflection) => {
		const pre = yafElement.makeElement('pre');
		pre.classList.add('highlight');
		pre.appendChild(yafElement.makeSymbolSpan(`${prefix} `));
		pre.appendChild(yafElement.makeNameSpan(data.name));

		const title: YafSignatureTitle = yafElement.makeElement(
			'yaf-signature-title'
		);
		title.props = { ...data, hideName: true };
		pre.appendChild(title);

		return pre;
	};
	makeBody = (data: YafSignatureReflection) => {
		const body: YafSignatureBody =
			yafElement.makeElement('yaf-signature-body');
		body.props = data;

		return body;
	};
}

const yafMemberGetterSetter = 'yaf-member-getter-setter';
customElements.define(yafMemberGetterSetter, YafMemberGetterSetter);
