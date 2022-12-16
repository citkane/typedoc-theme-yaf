import {
	htmlString,
	YAFDataObject,
	YafDeclarationReflection,
	YafTypeParameterReflection,
} from '../../../types/types';
import { YafSignatureParametersType } from '../Signature/index.js';
import { componentName, debouncer } from '../../../types/frontendTypes';
import { YafContentMarked } from '../Content/index.js';
import { YafTypeParameters } from '../Type/index.js';
import { YafMemberGroupReflection } from './index.js';
import yafElement from '../../yafElement.js';

const {
	debounce,
	makeElement,
	makeSymbolSpan,
	makeValueSpan,
	makeNameSpan,
	renderSignatureType,
} = yafElement;

/**
 *
 */
export class YafMemberDeclaration extends HTMLElement {
	props!: YafDeclarationReflection;

	connectedCallback() {
		if (debounce(this as debouncer)) return;

		//console.log(this.props);

		const { name, typeParameters, type, defaultValue, text } = this.props;
		const hasParameters = typeParameters && typeParameters.length;
		const hasComment = !!text?.comment;
		const isReflection = type?.type === 'reflection';

		const HTMLPreElement = makeElement('pre', 'highlight');
		const HTMLSignatureElements = [
			makeNameSpan(name),
			hasParameters ? this.factory.parameters(typeParameters) : undefined,
			type ? renderSignatureType(type, 'none') : undefined,
			defaultValue ? this.factory.defaultValue(defaultValue) : undefined,
		]
			.filter((element) => !!element)
			.flat();
		HTMLSignatureElements.forEach((element) =>
			HTMLPreElement.appendChild(element!)
		);

		const HTMLElements = [
			HTMLPreElement,
			hasComment ? this.factory.comment(text.comment!) : undefined,
			typeParameters
				? this.factory.typeParameters(typeParameters)
				: undefined,
			isReflection ? this.factory.reflection(type, name) : undefined,
		]
			.filter((element) => !!element)
			.flat();

		HTMLElements.forEach((element) => this.appendChild(element!));
	}
	private factory = {
		parameters: (typeParameters: YafTypeParameterReflection[]) =>
			makeElement<YafTypeParameters, YafTypeParameters['props']>(
				'yaf-type-parameters',
				null,
				null,
				typeParameters
			),

		defaultValue: (defaultValue: string) => [
			makeSymbolSpan(' = '),
			makeValueSpan(defaultValue),
		],

		typeParameters: (typeParameters: YafTypeParameterReflection[]) =>
			makeElement<
				YafSignatureParametersType,
				YafSignatureParametersType['props']
			>('yaf-signature-parameters-type', null, null, typeParameters),

		reflection: (type: typeof this.props.type, parentName: string) => {
			if (
				!type.declaration ||
				!type.declaration.children ||
				!type.declaration.children?.length
			)
				return undefined;
			console.log(type);
			const { groups, children, id } = type.declaration;
			return (
				groups?.map((group) => {
					const groupChildren =
						YafMemberGroupReflection.mapReflectionGroup(
							group,
							(children as YAFDataObject[]) || []
						);
					return makeElement<
						YafMemberGroupReflection,
						YafMemberGroupReflection['props']
					>('yaf-member-group-reflection', null, null, {
						title: `${parentName}: ${group.title}`,
						children: <YAFDataObject[]>groupChildren || [],
						pageId: String(id),
						nested: true,
					});
				}) || undefined
			);
		},
		comment: (comment: htmlString) =>
			makeElement<YafContentMarked, YafContentMarked['props']>(
				'yaf-content-marked',
				null,
				null,
				comment
			),
	};
}
const yafMemberDeclaration: componentName = 'yaf-member-declaration';
customElements.define(yafMemberDeclaration, YafMemberDeclaration);
