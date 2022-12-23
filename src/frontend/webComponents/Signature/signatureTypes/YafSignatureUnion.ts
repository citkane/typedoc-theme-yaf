import { componentName } from '../../../../types/frontendTypes.js';
import { JSONOutput } from 'typedoc';
import { renderSignatureType, makeSymbolSpan } from '../../../yafElement.js';
import { YafHTMLElement } from '../../../index.js';

export class YafSignatureUnion extends YafHTMLElement<JSONOutput.UnionType> {
	onConnect() {
		const { types } = this.props;

		const HTMLElements = types.map((type, i) => [
			renderSignatureType(type, 'unionElement'),
			i < types.length - 1 ? makeSymbolSpan(' | ') : undefined,
		]);

		this.appendChildren(HTMLElements.flat());
	}
}

const componentName: componentName = 'yaf-signature-union';
customElements.define(componentName, YafSignatureUnion);
