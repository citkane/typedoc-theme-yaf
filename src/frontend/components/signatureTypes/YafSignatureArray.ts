import { componentName } from '../../../types/types.js';
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
		this.needsParenthesis() && this.appendChild(this.makeSymbolSpan('('));

		const signature = this.makeElement<YafSignature>('yaf-signature');
		signature.props = {
			type: this.props.elementType,
			context: 'arrayElement',
		};
		this.appendChild(signature);
		this.appendChild(this.makeSymbolSpan('[]'));
		this.needsParenthesis() && this.appendChild(this.makeSymbolSpan(')'));
	}
}
const yafContentSignatureArray: componentName = 'yaf-signature-array';
customElements.define(yafContentSignatureArray, YafContentSignatureArray);
