import { componentName } from '../../types.js';
import { YafElement } from '../../YafElement.js';
import { JSONOutput } from 'typedoc';

export class YafContentSignatureIntrinsic extends YafElement {
	props!: JSONOutput.IntrinsicType;
	constructor() {
		super(componentName);
	}

	connectedCallback() {
		if (this.debounce()) return;
		this.classList.add('type');
		if (this.needsParenthesis()) {
			this.innerHTML = `<span class="symbol>(</span>${this.props.name}<span class="symbol>)</span>`;
		} else {
			this.innerText = this.props.name;
		}
	}
}

const componentName: componentName = 'yaf-signature-intrinsic';
customElements.define(componentName, YafContentSignatureIntrinsic);
