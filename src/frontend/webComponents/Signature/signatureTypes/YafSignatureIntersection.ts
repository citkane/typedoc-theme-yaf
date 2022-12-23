import { JSONOutput } from 'typedoc';
import { YafHTMLElement } from '../../../index.js';
import { renderSignatureType, makeSymbolSpan } from '../../../yafElement.js';

export class YafSignatureIntersection extends YafHTMLElement<JSONOutput.IntersectionType> {
	onConnect() {
		const { types } = this.props;

		const HTMLElements = types.map((type, i) => [
			renderSignatureType(type, 'intersectionElement'),
			i < types.length - 1 ? makeSymbolSpan(' & ') : undefined,
		]);

		this.appendChildren(HTMLElements.flat());
	}
}

const yafSignatureIntersection = 'yaf-signature-intersection';
customElements.define(yafSignatureIntersection, YafSignatureIntersection);
