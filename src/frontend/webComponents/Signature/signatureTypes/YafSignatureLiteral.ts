import { componentName } from '../../../../types/frontendTypes.js';
import yafElement from '../../../YafElement.js';
import { JSONOutput } from 'typedoc';

export class YafContentSignatureLiteral extends HTMLElement {
	props!: JSONOutput.LiteralType;

	connectedCallback() {
		if (yafElement.debounce(this as Record<string, unknown>)) return;
		this.classList.add('type');
		if (yafElement.needsParenthesis(this)) {
			this.innerHTML = `<span class="symbol>(</span>"${this.props.value}"<span class="symbol>)</span>`;
		} else {
			this.innerText = `"${this.props.value}"`;
		}
		/*
		const inner = YafElement.needsParenthesis()
			? `<span class="symbol>(</span>"${this.props.value}"<span class="symbol>)</span>`
			: `"${this.props.value}"`;

		const newElement = YafElement.makeElement(
			`<span class="type">${inner}</span>`
		);
		this.parentElement?.replaceChild(newElement, this);
		*/
	}
}

const componentName: componentName = 'yaf-signature-literal';
customElements.define(componentName, YafContentSignatureLiteral);
