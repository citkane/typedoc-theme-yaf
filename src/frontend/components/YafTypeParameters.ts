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
		this.appendChild(this.makeSpan('<', 'symbol'));
		this.props.forEach((parameter, i) => {
			if (parameter.varianceModifier)
				this.appendChild(
					this.makeSpan(`${parameter.varianceModifier} `)
				);
			this.appendChild(this.makeSpan(parameter.name, 'type'));
			if (i < this.props!.length - 1)
				this.appendChild(this.makeSpan(', ', 'symbol'));
		});
		this.appendChild(this.makeSpan('>', 'symbol'));
	}
}
const yafTypeParameters = 'yaf-type-parameters';
customElements.define(yafTypeParameters, YafTypeParameters);
