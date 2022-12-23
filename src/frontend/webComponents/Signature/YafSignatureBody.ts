import {
	YafSignature,
	YafSignatureParameters,
	YafSignatureParametersType,
} from './index.js';
import { componentName } from '../../../types/frontendTypes.js';
import { YafContentMarked } from '../Content';
import {
	YafParameterReflection,
	yafReflectionText,
	YafSignatureReflection,
	YafTypeParameterReflection,
} from '../../../types/types.js';
import { makeElement, renderSignatureType } from '../../yafElement.js';
import { YafHTMLElement } from '../../index.js';

export class YafSignatureBody extends YafHTMLElement<YafSignatureReflection> {
	onConnect() {
		const { text, typeParameter, parameters, type, kind } = this.props;
		const { factory } = YafSignatureBody;
		const isCallSignature = YafSignature.isCallSignature(kind);

		const HTMLElements = [
			factory.textComment(text),
			factory.typeParameters(typeParameter),
			factory.parameters(parameters),
			factory.returns(type, isCallSignature),
		];

		if (type?.type === 'reflection')
			console.warn(
				'Please check if a reflection declaration should/could ever be in a signature body.'
			);

		this.appendChildren(HTMLElements.flat());
	}

	private static factory = {
		makeElement: <T, P>(element: string, props: P) =>
			makeElement<T, P>(element, null, null, props),
		textComment: (text: yafReflectionText | undefined) =>
			text?.comment
				? this.factory.makeElement<
						YafContentMarked,
						YafContentMarked['props']
				  >('yaf-content-marked', text.comment)
				: undefined,
		typeParameters: (
			typeParameter: YafTypeParameterReflection[] | undefined
		) =>
			typeParameter && typeParameter.length
				? this.factory.makeElement<
						YafSignatureParametersType,
						YafSignatureParametersType['props']
				  >('yaf-signature-parameters-type', typeParameter)
				: undefined,
		parameters: (parameters: YafParameterReflection[] | undefined) =>
			parameters && parameters.length
				? this.factory.makeElement<
						YafSignatureParameters,
						YafSignatureParameters['props']
				  >('yaf-signature-parameters', parameters)
				: undefined,
		returns: (
			type: YafSignatureReflection['type'],
			isCallSignature: boolean
		) =>
			type && isCallSignature
				? [
						makeElement('h5', null, 'Returns:'),
						renderSignatureType(type, 'none'),
				  ]
				: undefined,
	};
}

const yafSignatureBody: componentName = 'yaf-signature-body';
customElements.define(yafSignatureBody, YafSignatureBody);
