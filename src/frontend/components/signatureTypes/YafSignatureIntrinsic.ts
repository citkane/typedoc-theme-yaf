import { componentName } from '../../../types/frontendTypes.js';
import yafElement from '../../YafElement.js';
import { JSONOutput } from 'typedoc';

export class YafContentSignatureIntrinsic extends HTMLElement {
	props!: JSONOutput.IntrinsicType;

	connectedCallback() {
		if (yafElement.debounce(this as Record<string, unknown>)) return;
		this.classList.add('type');
		if (yafElement.needsParenthesis(this)) {
			this.innerHTML = `<span class="symbol>(</span>${this.props.name}<span class="symbol>)</span>`;
		} else {
			this.innerText = this.props.name;
		}
	}
}

const componentName: componentName = 'yaf-signature-intrinsic';
customElements.define(componentName, YafContentSignatureIntrinsic);
