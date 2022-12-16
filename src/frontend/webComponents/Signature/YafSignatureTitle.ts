import { componentName, debouncer } from '../../../types/frontendTypes.js';
import { JSONOutput } from 'typedoc';
import { YafTypeParameters } from '../Type/index.js';
import appState from '../../lib/AppState.js';
import yafElement from '../../yafElement.js';
const {
	debounce,
	makeSymbolSpan,
	makeTitleSpan,
	makeElement,
	makeNameSpan,
	renderSignatureType,
} = yafElement;

export class YafSignatureTitle extends HTMLElement {
	props!: {
		hideName?: boolean;
		arrowStyle?: boolean;
	} & JSONOutput.SignatureReflection;

	connectedCallback() {
		if (debounce(this as debouncer)) return;

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

		const HTMLElements = [];

		if (!hideName) {
			const nameParts = name.split(' ');
			const signatureName = nameParts.pop();
			const signatureNameConstructor = nameParts.join(' ');

			HTMLElements.push([
				signatureNameConstructor.length
					? makeSymbolSpan(`${signatureNameConstructor} `)
					: undefined,
				makeTitleSpan(signatureName!),
			]);
		} else if (kind === appState.reflectionKind.ConstructorSignature) {
			HTMLElements.push(
				makeSymbolSpan(`${flags.isAbstract ? 'abstract new ' : 'new '}`)
			);
		}
		HTMLElements.push([
			typeParameter
				? makeElement<YafTypeParameters, YafTypeParameters['props']>(
						'yaf-type-parameters',
						null,
						null,
						typeParameter
				  )
				: undefined,

			makeSymbolSpan('('),
		]);

		parameters?.forEach((parameter, i) => {
			const isRest = parameter.flags.isRest;
			const isOptional = parameter.flags.isOptional;
			const defaultValue = parameter.defaultValue;

			const HTMLWrapper = makeElement('span', 'wrapper');
			const wrapperHTMLElements = [
				isRest ? makeSymbolSpan('...') : undefined,
				makeNameSpan(parameter.name),
				isOptional ? makeSymbolSpan('?') : undefined,
				defaultValue ? makeSymbolSpan('?') : undefined,
				makeSymbolSpan(':'),
				renderSignatureType(parameter.type, 'none'),
				i < parameters!.length - 1 ? makeSymbolSpan(', ') : undefined,
			].filter((element) => !!element);

			wrapperHTMLElements.forEach((element) =>
				HTMLWrapper.appendChild(element!)
			);
			HTMLElements.push(HTMLWrapper);
		});
		HTMLElements.push(makeSymbolSpan(')'));

		if (type) {
			HTMLElements.push([
				makeSymbolSpan(`${arrowStyle ? ' => ' : ': '}`),
				renderSignatureType(type, 'none'),
			]);
		}
		HTMLElements.flat()
			.filter((element) => !!element)
			.forEach((span) => this.appendChild(span!));
	}
}
const yafSignatureTitle: componentName = 'yaf-signature-title';
customElements.define(yafSignatureTitle, YafSignatureTitle);
