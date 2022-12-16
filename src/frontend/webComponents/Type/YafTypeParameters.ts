import { debouncer } from '../../../types/frontendTypes.js';
import { YAFDataObject } from '../../../types/types.js';
import yafElement from '../../yafElement.js';
const { debounce, makeElement, makeSymbolSpan } = yafElement;

export class YafTypeParameters extends HTMLElement {
	props!: YAFDataObject['typeParameters'];

	connectedCallback() {
		if (debounce(this as debouncer)) return;

		const params = (this.props || []).flatMap((param) => {
			const span = makeElement(
				'span',
				`type ${param.kindString ? ` ${param.kindString}` : ''}`,
				param.name
			);
			return param.varianceModifier
				? [
						makeElement(
							'span',
							'modifier',
							`${param.varianceModifier}`
						),
						span,
				  ]
				: span;
		});
		this.appendChild(makeSymbolSpan('<'));
		params.forEach((param, i) => {
			this.appendChild(param);
			if (i >= params.length - 1) return;
			this.appendChild(makeSymbolSpan(','));
		});
		this.appendChild(makeSymbolSpan('>'));
	}
}
const yafTypeParameters = 'yaf-type-parameters';
customElements.define(yafTypeParameters, YafTypeParameters);
