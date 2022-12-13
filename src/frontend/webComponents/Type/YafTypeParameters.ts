import { YAFDataObject } from '../../../types/types.js';
import yafElement from '../../YafElement.js';

export class YafTypeParameters extends HTMLElement {
	props!: YAFDataObject['typeParameters'];
	connectedCallback() {
		if (yafElement.debounce(this as Record<string, unknown>)) return;

		const params = (this.props || []).flatMap((param) => {
			const span = yafElement.makeElement(
				'span',
				`type ${param.kindString ? ` ${param.kindString}` : ''}`,
				param.name
			);
			return param.varianceModifier
				? [
						yafElement.makeElement(
							'span',
							'modifier',
							`${param.varianceModifier}`
						),
						span,
				  ]
				: span;
		});
		this.appendChild(yafElement.makeSymbolSpan('<'));
		params.forEach((param) => this.appendChild(param));
		this.appendChild(yafElement.makeSymbolSpan('>'));
	}
	/*
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
	*/
}
const yafTypeParameters = 'yaf-type-parameters';
customElements.define(yafTypeParameters, YafTypeParameters);
