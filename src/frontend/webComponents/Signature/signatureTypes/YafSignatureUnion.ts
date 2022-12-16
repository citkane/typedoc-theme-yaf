import { componentName, debouncer } from '../../../../types/frontendTypes.js';
import { JSONOutput } from 'typedoc';
import yafElement from '../../../yafElement.js';
const { debounce, renderSignatureType, makeSymbolSpan } = yafElement;

export class YafSignatureUnion extends HTMLElement {
	props!: JSONOutput.UnionType;

	connectedCallback() {
		if (debounce(this as debouncer)) return;

		const { types } = this.props;

		const HTMLElements = types
			.map((type, i) => {
				const typeElements = [
					renderSignatureType(type, 'unionElement'),
				];
				if (i >= types.length - 1) return typeElements;
				typeElements.push(makeSymbolSpan(' | '));
				return typeElements;
			})
			.flat();

		HTMLElements.forEach((element) => this.appendChild(element));
	}
}

const componentName: componentName = 'yaf-signature-union';
customElements.define(componentName, YafSignatureUnion);
