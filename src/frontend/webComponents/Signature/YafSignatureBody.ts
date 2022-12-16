import {
	YafSignature,
	YafSignatureParameters,
	YafSignatureParametersType,
} from './index.js';
import { componentName, debouncer } from '../../../types/frontendTypes.js';
import { YafContentMarked } from '../Content';
import { YafSignatureReflection } from '../../../types/types.js';
import yafElement from '../../yafElement.js';
const { debounce, makeElement } = yafElement;

export class YafSignatureBody extends HTMLElement {
	props!: YafSignatureReflection;

	connectedCallback() {
		if (debounce(this as debouncer)) return;

		const { text, typeParameter, parameters, type } = this.props;

		const HTMLElements = [
			text.comment
				? YafSignatureBody.makeElement<
						YafContentMarked,
						YafContentMarked['props']
				  >('yaf-content-marked', text.comment)
				: undefined,

			typeParameter && typeParameter.length
				? YafSignatureBody.makeElement<
						YafSignatureParametersType,
						YafSignatureParametersType['props']
				  >('yaf-signature-parameters-type', typeParameter)
				: undefined,

			parameters && parameters.length
				? YafSignatureBody.makeElement<
						YafSignatureParameters,
						YafSignatureParameters['props']
				  >('yaf-signature-parameters', parameters)
				: undefined,

			type
				? [
						makeElement('h5', null, 'Returns:'),
						YafSignatureBody.makeElement<
							YafSignature,
							YafSignature['props']
						>('yaf-signature', { type, context: 'none' }),
				  ]
				: undefined,

			/*
			type?.type === 'reflection' && type?.declaration
				? YafSignatureBody.makeElement<
						YafMemberParameters,
						YafMemberParameters['props']
				  >('yaf-signature-parameters', type?.declaration)
				: undefined,
				*/
		]
			.filter((element) => !!element)
			.flat();

		if (type?.type === 'reflection')
			console.warn(
				'Please check if a reflection declaration should/could ever be in a signature body.'
			);

		HTMLElements.forEach((element) => this.appendChild(element!));
	}

	/**
	 * A helper factory to keep the code tidier
	 *
	 * @param element
	 * @param props
	 * @returns
	 */
	private static makeElement = <T, P>(element: string, props: P) =>
		makeElement<T, P>(element, null, null, props);
}

const yafSignatureBody: componentName = 'yaf-signature-body';
customElements.define(yafSignatureBody, YafSignatureBody);
