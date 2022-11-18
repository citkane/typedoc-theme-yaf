import { componentName } from '../../types.js';
import { JSONOutput } from 'typedoc';
import { YafElement } from '../../YafElement.js';
import { YafSignature } from '../YafSignature.js';

export class YafContentSignatureArray extends YafElement {
	constructor() {
		super(yafContentSignatureArray);
	}
	props!: JSONOutput.ArrayType;
	connectedCallback() {
		if (this.debounce()) return;
		this.classList.add('type');
		this.needsParenthesis() &&
			this.appendChild(this.makeSpan('(', 'symbol'));

		const signature: YafSignature = this.makeElement(
			'<yaf-signature></yaf-signature>'
		);
		signature.props = {
			type: this.props.elementType,
			context: 'arrayElement',
		};
		this.appendChild(signature);
		this.appendChild(this.makeSpan('[]', 'symbol'));
		this.needsParenthesis() &&
			this.appendChild(this.makeSpan(')', 'symbol'));
	}
}
const yafContentSignatureArray: componentName = 'yaf-signature-array';
customElements.define(yafContentSignatureArray, YafContentSignatureArray);
