import { componentName } from '../../../../types/frontendTypes.js';
import yafElement from '../../../YafElement.js';
import { JSONOutput } from 'typedoc';

export class YafSignatureUnion extends HTMLElement {
	props!: JSONOutput.UnionType;

	connectedCallback() {
		if (yafElement.debounce(this as Record<string, unknown>)) return;
		this.props.types.forEach((type, i) => {
			this.appendChild(
				yafElement.renderSignatureType(type, 'unionElement')
			);
			if (i < this.props.types.length - 1)
				this.appendChild(yafElement.makeSymbolSpan(' | '));
		});
	}
}

const componentName: componentName = 'yaf-signature-union';
customElements.define(componentName, YafSignatureUnion);
