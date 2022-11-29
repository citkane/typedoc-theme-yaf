import { componentName } from '../../../types/types.js';
import { YafElement } from '../../YafElement.js';
import { JSONOutput } from 'typedoc';

export class YafSignatureUnion extends YafElement {
	constructor() {
		super(componentName);
	}
	props!: JSONOutput.UnionType;
	connectedCallback() {
		if (this.debounce()) return;
		this.props.types.forEach((type, i) => {
			this.appendChild(this.renderSignatureType(type, 'unionElement'));
			if (i < this.props.types.length - 1)
				this.appendChild(this.makeSymbolSpan(' | '));
		});
	}
}

const componentName: componentName = 'yaf-signature-union';
customElements.define(componentName, YafSignatureUnion);
