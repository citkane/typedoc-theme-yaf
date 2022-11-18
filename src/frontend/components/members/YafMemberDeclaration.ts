import {
	componentName,
	YAFDataObject,
	YafDeclarationReflection,
} from '../../types';
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
		const {
			name,
			typeParameters,
			parameters,
			type,
			flags,
			defaultValue,
			text,
		} = this.props;
		const pre = this.makeElement('<pre />');
		const title = this.makeSpan(name, 'title');
		pre.classList.add('highlight');
		pre.appendChild(title);

		if (typeParameters && typeParameters.length) {
			const typeParamsElement: YafTypeParams = this.makeElement(
				'<yaf-type-params />'
			);
			typeParamsElement.props = {
				typeParameters,
			};
			pre.appendChild(typeParamsElement);
		}
		if (type) {
			const optional = flags.isOptional ? '?' : '';
			this.appendSpanTo(`${optional}: `, 'symbol', pre);
			const signatureType: YafSignature = this.makeElement(
				'<yaf-signature></yaf-signature>'
			);
			signatureType.props = {
				type,
				context: 'none',
			};
			pre.appendChild(signatureType);
		}

		if (defaultValue) {
			this.appendSpanTo(' = ', 'symbol', pre);
			this.appendSpanTo(defaultValue, 'value', pre);
		}
		this.appendChild(pre);

		if (text?.comment) {
			const commentElement: YafContentMarked = this.makeElement(
				'<yaf-content-marked />'
			);
			commentElement.props = text.comment;
			this.appendChild(commentElement);
		}

		if (typeParameters) {
			const typeParameterElement: YafMemberParametersType =
				this.makeElement('<yaf-member-parameters-type />');
			typeParameterElement.props = typeParameters;
			this.appendChild(typeParameterElement);
		}

		if (type?.type === 'reflection') {
			const parametersElement: YafMemberParameters = this.makeElement(
				'<yaf-member-parameters />'
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
			const span = this.makeSpan(
				param.name,
				`type ${param.kindString ? ` ${param.kindString}` : ''}`
			);
			return param.varianceModifier
				? [this.makeSpan(`${param.varianceModifier}`, 'modifier'), span]
				: span;
		});
		this.appendChild(this.makeSpan('<', 'symbol'));
		params.forEach((param) => this.appendChild(param));
		this.appendChild(this.makeSpan('>', 'symbol'));
	}
}
const yafTypeParams: componentName = 'yaf-type-params';
customElements.define(yafTypeParams, YafTypeParams);
