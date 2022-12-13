import { componentName } from '../../../types/frontendTypes';
import { YafDeclarationReflection } from '../../../types/types';
import yafElement from '../../YafElement.js';
import { YafContentMarked } from '../Content/index.js';
import { YafSignature } from '../Signature/index.js';
import { YafTypeParameters } from '../Type/index.js';
import {
	YafMemberParameters,
	YafMemberParametersType,
} from './YafMemberParameters';

/**
 *
 */
export class YafMemberDeclaration extends HTMLElement {
	props!: YafDeclarationReflection;

	connectedCallback() {
		if (yafElement.debounce(this as Record<string, unknown>)) return;

		const { name, typeParameters, type, flags, defaultValue, text } =
			this.props;

		const pre = yafElement.makeElement('pre');
		const title = yafElement.makeElement('element', 'title', name);
		pre.classList.add('highlight');
		pre.appendChild(title);

		if (typeParameters && typeParameters.length) {
			pre.appendChild(
				yafElement.makeElement<
					YafTypeParameters,
					YafTypeParameters['props']
				>('yaf-type-parameters', null, null, typeParameters)
			);
		}
		if (type) {
			pre.appendChild(
				yafElement.makeSymbolSpan(flags.isOptional ? '?: ' : ': ')
			);

			const signatureType =
				yafElement.makeElement<YafSignature>('yaf-signature');
			signatureType.props = {
				type,
				context: 'none',
			};
			pre.appendChild(signatureType);
		}

		if (defaultValue) {
			pre.appendChild(yafElement.makeSymbolSpan(' = '));
			pre.appendChild(yafElement.makeValueSpan(defaultValue));
		}
		this.appendChild(pre);

		if (text?.comment) {
			const commentElement: YafContentMarked =
				yafElement.makeElement('yaf-content-marked');
			commentElement.props = text.comment;
			this.appendChild(commentElement);
		}

		if (typeParameters) {
			const typeParameterElement: YafMemberParametersType =
				yafElement.makeElement('yaf-member-parameters-type');
			typeParameterElement.props = typeParameters;
			this.appendChild(typeParameterElement);
		}

		if (type?.type === 'reflection') {
			const parametersElement: YafMemberParameters =
				yafElement.makeElement('yaf-member-parameters');
			parametersElement.props = type.declaration
				?.children as YafDeclarationReflection[];
			this.appendChild(parametersElement);
		}
	}
}
const yafMemberDeclaration: componentName = 'yaf-member-declaration';
customElements.define(yafMemberDeclaration, YafMemberDeclaration);

/*
export class YafTypeParams extends HTMLElement {
	props!: { typeParameters: YAFDataObject['typeParameters'] };
	connectedCallback() {
		if (yafElement.debounce(this as Record<string, unknown>)) return;
		const params = (this.props.typeParameters || []).flatMap((param) => {
			const span = yafElement.makeElement(
				'span',
				`type ${param.kindString ? ` ${param.kindString}` : ''}`,
				param.name
			);
			return param.varianceModifier
				? [
						yafElement.makeElement(
							'span',
							'modifier',
							`${param.varianceModifier}`
						),
						span,
				  ]
				: span;
		});
		this.appendChild(yafElement.makeSymbolSpan('<'));
		params.forEach((param) => this.appendChild(param));
		this.appendChild(yafElement.makeSymbolSpan('>'));
	}
}
const yafTypeParams: componentName = 'yaf-type-params';
customElements.define(yafTypeParams, YafTypeParams);
*/
