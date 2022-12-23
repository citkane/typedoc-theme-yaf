import { JSONOutput } from 'typedoc';
import { YafHTMLElement } from '../../../index.js';
import {
	makeSymbolSpan,
	makeTypeSpan,
	renderSignatureType,
} from '../../../yafElement.js';

export class YafSignatureInferred extends YafHTMLElement<JSONOutput.InferredType> {
	onConnect() {
		const { name, constraint } = this.props;
		const HTMLElements: (HTMLElement | HTMLElement[])[] = [
			makeSymbolSpan('infer '),
			makeTypeSpan(name),
		];

		if (constraint) {
			HTMLElements.push([
				makeSymbolSpan(' extends '),
				renderSignatureType(constraint, 'inferredConstraint'),
			]);
		}

		this.appendChildren(HTMLElements.flat());
	}
}

const yafSignatureinferred = 'yaf-signature-inferred';
customElements.define(yafSignatureinferred, YafSignatureInferred);
