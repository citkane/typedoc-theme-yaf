import { YAFDataObject, YafSignatureReflection } from '../../../types/types.js';
import { YafElement } from '../../YafElement.js';
import { YafSignatureBody } from '../YafSignatureBody.js';
import { YafSignatureTitle } from '../YafSignatureTitle.js';

export class YafMemberGetterSetter extends YafElement {
	props!: YAFDataObject;
	constructor() {
		super(yafMemberGetterSetter);
	}
	connectedCallback() {
		if (this.debounce()) return;

		const { getSignature, setSignature } = this.props;
		if (getSignature) {
			const wrapper = this.makeElement('div');
			wrapper.classList.add('wrapper');
			wrapper.appendChild(this.makeSignature('get', getSignature));
			wrapper.appendChild(this.makeBody(getSignature));
			this.appendChild(wrapper);
		}

		if (setSignature) {
			const wrapper = this.makeElement('div');
			wrapper.classList.add('wrapper');
			this.appendChild(this.makeSignature('set', setSignature));
			this.appendChild(this.makeBody(setSignature));
			this.appendChild(wrapper);
		}
	}
	makeSignature = (prefix: string, data: YafSignatureReflection) => {
		const pre = this.makeElement('pre');
		pre.classList.add('highlight');
		pre.appendChild(this.makeSymbolSpan(`${prefix} `));
		pre.appendChild(this.makeNameSpan(data.name));

		const title: YafSignatureTitle = this.makeElement(
			'yaf-signature-title'
		);
		title.props = { ...data, hideName: true };
		pre.appendChild(title);

		return pre;
	};
	makeBody = (data: YafSignatureReflection) => {
		const body: YafSignatureBody = this.makeElement('yaf-signature-body');
		body.props = data;

		return body;
	};
}

const yafMemberGetterSetter = 'yaf-member-getter-setter';
customElements.define(yafMemberGetterSetter, YafMemberGetterSetter);
