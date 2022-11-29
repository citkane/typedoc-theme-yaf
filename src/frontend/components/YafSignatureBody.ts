import { componentName, YafSignatureReflection } from '../../types/types.js';
import { YafElement } from '../YafElement.js';
import { YafContentMarked } from './YafContentMarked.js';
import {
	YafMemberParameters,
	YafMemberParametersType,
} from './YafContentMembers.js';
import { YafSignature } from './YafSignature.js';

export class YafSignatureBody extends YafElement {
	props!: YafSignatureReflection;

	constructor() {
		super(yafSignatureBody);
	}
	connectedCallback() {
		if (this.debounce()) return;

		const { text, typeParameter, parameters, type } = this.props;

		if (text.comment) {
			const comment: YafContentMarked =
				this.makeElement('yaf-content-marked');
			comment.props = text.comment;
			this.appendChild(comment);
		}

		if (typeParameter && typeParameter.length) {
			const typeParameterElement: YafMemberParametersType =
				this.makeElement('yaf-member-parameters-type');
			typeParameterElement.props = typeParameter;
			this.appendChild(typeParameterElement);
		}

		if (parameters && parameters.length) {
			const parametersElement: YafMemberParameters = this.makeElement(
				'yaf-member-parameters'
			);
			parametersElement.props = parameters;
			this.appendChild(parametersElement);
		}

		if (type) {
			const title = this.makeElement('h5', null, 'Returns:');
			//title.innerText = 'Returns:';
			this.appendChild(title);
			const signature: YafSignature = this.makeElement('yaf-signature');
			signature.props = { type, context: 'none' };
			this.appendChild(signature);

			if (type.type === 'reflection') console.warn(type);
		}
	}
}
const yafSignatureBody: componentName = 'yaf-signature-body';
customElements.define(yafSignatureBody, YafSignatureBody);
