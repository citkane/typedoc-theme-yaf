import { YAFDataObject } from '../../../types/types.js';
import { YafHTMLElement } from '../../index.js';
import { makeElement, makeSymbolSpan } from '../../yafElement.js';

export class YafTypeParameters extends YafHTMLElement<
	YAFDataObject['typeParameters']
> {
	onConnect() {
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
