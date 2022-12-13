import { componentName } from '../../../../types/frontendTypes.js';
import { JSONOutput } from 'typedoc';
import yafElement from '../../../YafElement.js';
import { YafSignature } from '../YafSignature.js';

export class YafSignatureArray extends HTMLElement {
	props!: JSONOutput.ArrayType;
	connectedCallback() {
		if (yafElement.debounce(this as Record<string, unknown>)) return;
		this.classList.add('type');
		yafElement.needsParenthesis(this) &&
			this.appendChild(yafElement.makeSymbolSpan('('));

		const signature = yafElement.makeElement<YafSignature>('yaf-signature');
		signature.props = {
			type: this.props.elementType,
			context: 'arrayElement',
		};
		this.appendChild(signature);
		this.appendChild(yafElement.makeSymbolSpan('[]'));
		yafElement.needsParenthesis(this) &&
			this.appendChild(yafElement.makeSymbolSpan(')'));
	}
}
const yafSignatureArray: componentName = 'yaf-signature-array';
customElements.define(yafSignatureArray, YafSignatureArray);
