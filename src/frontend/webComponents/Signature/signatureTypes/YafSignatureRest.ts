import { JSONOutput } from 'typedoc';
import { componentName } from '../../../../types/frontendTypes.js';
import { YafHTMLElement } from '../../../index.js';
import { makeSymbolSpan, renderSignatureType } from '../../../yafElement.js';

export class YafSignatureRest extends YafHTMLElement<JSONOutput.RestType> {
	onConnect() {
		const { elementType } = this.props;

		const HTMLElements = [
			makeSymbolSpan('...'),
			renderSignatureType(elementType, 'restElement'),
		];

		this.appendChildren(HTMLElements.flat());
	}
}

const yafSignatureRest: componentName = 'yaf-signature-rest';
customElements.define(yafSignatureRest, YafSignatureRest);
