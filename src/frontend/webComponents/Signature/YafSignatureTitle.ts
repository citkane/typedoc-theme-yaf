import { JSONOutput } from 'typedoc';
import { componentName } from '../../../types/frontendTypes.js';
import appState from '../../lib/AppState.js';
import yafElement from '../../YafElement.js';
import { YafTypeParameters } from '../Type/index.js';

export class YafSignatureTitle extends HTMLElement {
	props!: {
		hideName?: boolean;
		arrowStyle?: boolean;
	} & JSONOutput.SignatureReflection;

	connectedCallback() {
		if (yafElement.debounce(this as Record<string, unknown>)) return;

		const innerElementList: HTMLElement[] = [];
		const {
			name,
			kind,
			flags,
			typeParameter,
			parameters,
			type,
			hideName,
			arrowStyle,
		} = this.props;

		if (!hideName) {
			const nameParts = name.split(' ');
			const signatureName = nameParts.pop();
			const signatureNameConstructor = nameParts.join(' ');

			if (signatureNameConstructor.length) {
				innerElementList.push(
					yafElement.makeSymbolSpan(`${signatureNameConstructor} `)
				);
			}
			innerElementList.push(yafElement.makeTitleSpan(signatureName!));
		} else if (kind === appState.reflectionKind.ConstructorSignature) {
			innerElementList.push(
				yafElement.makeSymbolSpan(
					`${flags.isAbstract ? 'abstract new ' : 'new '}`
				)
			);
		}

		if (typeParameter)
			innerElementList.push(
				yafElement.makeElement<
					YafTypeParameters,
					YafTypeParameters['props']
				>('yaf-type-parameters', null, null, typeParameter)
			);

		innerElementList.push(yafElement.makeSymbolSpan('('));
		parameters?.forEach((parameter, i) => {
			const wrapper = yafElement.makeElement('span', 'wrapper');

			if (parameter.flags.isRest) {
				wrapper.appendChild(yafElement.makeSymbolSpan('...'));
			}
			wrapper.appendChild(yafElement.makeNameSpan(parameter.name));
			if (parameter.flags.isOptional) {
				wrapper.appendChild(yafElement.makeSymbolSpan('?'));
			}
			if (parameter.defaultValue) {
				wrapper.appendChild(yafElement.makeSymbolSpan('?'));
			}
			wrapper.appendChild(yafElement.makeSymbolSpan(':'));
			wrapper.appendChild(
				yafElement.renderSignatureType(parameter.type, 'none')
			);
			if (i < parameters!.length - 1) {
				wrapper.appendChild(yafElement.makeSymbolSpan(', '));
			}
			innerElementList.push(wrapper);
		});

		innerElementList.push(yafElement.makeSymbolSpan(')'));

		if (type) {
			innerElementList.push(
				yafElement.makeSymbolSpan(`${arrowStyle ? ' => ' : ': '}`)
			);
			innerElementList.push(yafElement.renderSignatureType(type, 'none'));
		}
		innerElementList.forEach((span) => this.appendChild(span));
	}
}
const yafSignatureTitle: componentName = 'yaf-signature-title';
customElements.define(yafSignatureTitle, YafSignatureTitle);
