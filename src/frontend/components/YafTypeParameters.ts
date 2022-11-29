import { JSONOutput } from 'typedoc';
import { YafElement } from '../YafElement.js';

export * from './signatureTypes/index.js';

export class YafTypeParameters extends YafElement {
	props!: JSONOutput.TypeParameterReflection[] | undefined; //SignatureReflection['typeParameter'];
	constructor() {
		super(yafTypeParameters);
	}
	connectedCallback() {
		if (this.debounce()) return;

		if (!this.props || !this.props.length) return;
		this.appendChild(this.makeSymbolSpan('<'));
		this.props.forEach((parameter, i) => {
			if (parameter.varianceModifier)
				this.appendChild(
					this.makeElement(
						'span',
						null,
						`${parameter.varianceModifier} `
					)
				);
			this.appendChild(this.makeTypeSpan(parameter.name));
			if (i < this.props!.length - 1)
				this.appendChild(this.makeSymbolSpan(', '));
		});
		this.appendChild(this.makeSymbolSpan('>'));
	}
}
const yafTypeParameters = 'yaf-type-parameters';
customElements.define(yafTypeParameters, YafTypeParameters);
