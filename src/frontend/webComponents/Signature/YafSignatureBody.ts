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
import {
	makeElement,
	makeLinkElement,
	renderSignatureType,
} from '../../yafElement.js';
import { YafHTMLElement } from '../../index.js';
import { YafMemberSources } from '../Member/index.js';
import appState from '../../handlers/AppState.js';

export class YafSignatureBody extends YafHTMLElement<YafSignatureReflection> {
	onConnect() {
		const { text, typeParameter, parameters, type, kind, inheritedFrom } =
			this.props;

		const { factory } = YafSignatureBody;
		const isCallSignature = YafSignature.isCallSignature(kind);

		const HTMLElements = [
			factory.textComment(text),
			factory.sources(this.props),
			factory.typeParameters(typeParameter),
			factory.parameters(parameters),
			factory.inherited(inheritedFrom),
			factory.returns(type, isCallSignature),
		];

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
		sources: (reflection: YafSignatureReflection) => {
			if (!reflection.sources?.length) return undefined;
			return this.factory.makeElement<
				YafMemberSources,
				YafMemberSources['props']
			>('yaf-member-sources', reflection);
		},
		returns: (
			type: YafSignatureReflection['type'],
			isCallSignature: boolean
		) => {
			if (!(type && isCallSignature)) return undefined;

			const ulHTMLElement = makeElement('ul', 'references');
			const liHTMLElement = makeElement('li');

			liHTMLElement.appendChild(renderSignatureType(type, 'none'));
			ulHTMLElement.appendChild(liHTMLElement);

			return [makeElement('h5', null, 'Returns:'), ulHTMLElement];
		},
		inherited: (inheritedFrom: YafSignatureReflection['inheritedFrom']) => {
			if (!inheritedFrom) return undefined;

			let data;
			if (inheritedFrom.id) {
				const reflection = appState.reflectionMap[inheritedFrom.id];
				let name = reflection.name.split(' ').pop();
				const refName = reflection.query.split('.').pop();
				const isConstructor = name === refName;
				name = isConstructor
					? `${refName}.constructor`
					: `${refName}.${name}`;

				data = {
					name,
					link: isConstructor
						? `?page=${reflection.query}#constructor`
						: `?page=${reflection.query}#${name}`,
				};
			} else {
				data = { name: inheritedFrom.name, link: null };
			}
			const headingEHTMLElement = makeElement(
				'h5',
				null,
				'Inherited from:'
			);
			const ulHTMLElement = makeElement('ul', 'references');
			const liHTMLElement = makeElement(
				'li',
				null,
				data.link ? '' : data.name
			);
			if (data.link)
				liHTMLElement.appendChild(
					makeLinkElement(data.link, undefined, data.name)
				);
			ulHTMLElement.appendChild(liHTMLElement);
			return [headingEHTMLElement, ulHTMLElement];
		},
	};
}

const yafSignatureBody: componentName = 'yaf-signature-body';
customElements.define(yafSignatureBody, YafSignatureBody);
