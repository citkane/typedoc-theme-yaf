import { JSONOutput } from 'typedoc';
import yafElement from '../YafElement.js';

export * from './signatureTypes/index.js';

export class YafTypeParameters extends HTMLElement {
	props!: JSONOutput.TypeParameterReflection[] | undefined;

	connectedCallback() {
		if (yafElement.debounce(this as Record<string, unknown>)) return;

		if (!this.props || !this.props.length) return;
		this.appendChild(yafElement.makeSymbolSpan('<'));
		this.props.forEach((parameter, i) => {
			if (parameter.varianceModifier)
				this.appendChild(
					yafElement.makeElement(
						'span',
						null,
						`${parameter.varianceModifier} `
					)
				);
			this.appendChild(yafElement.makeTypeSpan(parameter.name));
			if (i < this.props!.length - 1)
				this.appendChild(yafElement.makeSymbolSpan(', '));
		});
		this.appendChild(yafElement.makeSymbolSpan('>'));
	}
}
const yafTypeParameters = 'yaf-type-parameters';
customElements.define(yafTypeParameters, YafTypeParameters);
