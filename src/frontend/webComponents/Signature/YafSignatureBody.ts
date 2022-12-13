import { componentName } from '../../../types/frontendTypes.js';
import { YafSignatureReflection } from '../../../types/types.js';
import yafElement from '../../YafElement.js';
import { YafContentMarked } from '../Content';
import { YafMemberParameters, YafMemberParametersType } from '../Member';

import { YafSignature } from './YafSignature.js';

export class YafSignatureBody extends HTMLElement {
	props!: YafSignatureReflection;

	connectedCallback() {
		if (yafElement.debounce(this as Record<string, unknown>)) return;

		const { text, typeParameter, parameters, type } = this.props;

		if (text.comment) {
			this.appendChild(
				yafElement.makeElement<
					YafContentMarked,
					YafContentMarked['props']
				>('yaf-content-marked', null, null, text.comment)
			);
		}

		if (typeParameter && typeParameter.length) {
			this.appendChild(
				yafElement.makeElement<
					YafMemberParametersType,
					YafMemberParametersType['props']
				>('yaf-member-parameters-type', null, null, typeParameter)
			);
		}

		if (parameters && parameters.length) {
			this.appendChild(
				yafElement.makeElement<
					YafMemberParameters,
					YafMemberParameters['props']
				>('yaf-member-parameters', null, null, parameters)
			);
		}

		if (type) {
			this.appendChild(yafElement.makeElement('h5', null, 'Returns:'));
			this.appendChild(
				yafElement.makeElement<YafSignature, YafSignature['props']>(
					'yaf-signature',
					null,
					null,
					{ type, context: 'none' }
				)
			);

			if (type.type === 'reflection') console.warn(type);
		}
	}
}
const yafSignatureBody: componentName = 'yaf-signature-body';
customElements.define(yafSignatureBody, YafSignatureBody);
