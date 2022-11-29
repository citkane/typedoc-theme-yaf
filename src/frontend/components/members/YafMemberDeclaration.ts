import {
	componentName,
	YAFDataObject,
	YafDeclarationReflection,
} from '../../../types/types';
import { YafElement } from '../../YafElement.js';
import { YafContentMarked } from '../YafContentMarked';
import { YafSignature } from '../YafSignature';
import {
	YafMemberParameters,
	YafMemberParametersType,
} from './YafMemberParameters';

/**
 *
 */
export class YafMemberDeclaration extends YafElement {
	constructor() {
		super(yafMemberDeclaration);
	}
	props!: YafDeclarationReflection;
	async connectedCallback() {
		const { name, typeParameters, type, flags, defaultValue, text } =
			this.props;
		const pre = this.makeElement('pre');
		const title = this.makeElement('element', 'title', name);
		pre.classList.add('highlight');
		pre.appendChild(title);

		if (typeParameters && typeParameters.length) {
			const typeParamsElement =
				this.makeElement<YafTypeParams>('yaf-type-params');
			typeParamsElement.props = {
				typeParameters,
			};
			pre.appendChild(typeParamsElement);
		}
		if (type) {
			const optional = this.makeSymbolSpan(flags.isOptional ? '?' : '');
			pre.appendChild(optional);

			const signatureType =
				this.makeElement<YafSignature>('yaf-signature');
			signatureType.props = {
				type,
				context: 'none',
			};
			pre.appendChild(signatureType);
		}

		if (defaultValue) {
			pre.appendChild(this.makeSymbolSpan(' = '));
			pre.appendChild(this.makeValueSpan(defaultValue));
		}
		this.appendChild(pre);

		if (text?.comment) {
			const commentElement: YafContentMarked =
				this.makeElement('yaf-content-marked');
			commentElement.props = text.comment;
			this.appendChild(commentElement);
		}

		if (typeParameters) {
			const typeParameterElement: YafMemberParametersType =
				this.makeElement('yaf-member-parameters-type');
			typeParameterElement.props = typeParameters;
			this.appendChild(typeParameterElement);
		}

		if (type?.type === 'reflection') {
			const parametersElement: YafMemberParameters = this.makeElement(
				'yaf-member-parameters'
			);
			parametersElement.props = type.declaration
				?.children as YafDeclarationReflection[];
			this.appendChild(parametersElement);
		}
	}
}
const yafMemberDeclaration: componentName = 'yaf-member-declaration';
customElements.define(yafMemberDeclaration, YafMemberDeclaration);

/**
 *
 */
export class YafTypeParams extends YafElement {
	constructor() {
		super(yafTypeParams);
	}
	props!: { typeParameters: YAFDataObject['typeParameters'] };
	connectedCallback() {
		if (this.debounce()) return;
		const params = (this.props.typeParameters || []).flatMap((param) => {
			const span = this.makeElement(
				'span',
				`type ${param.kindString ? ` ${param.kindString}` : ''}`,
				param.name
			);
			return param.varianceModifier
				? [
						this.makeElement(
							'span',
							'modifier',
							`${param.varianceModifier}`
						),
						span,
				  ]
				: span;
		});
		this.appendChild(this.makeSymbolSpan('<'));
		params.forEach((param) => this.appendChild(param));
		this.appendChild(this.makeSymbolSpan('>'));
	}
}
const yafTypeParams: componentName = 'yaf-type-params';
customElements.define(yafTypeParams, YafTypeParams);
