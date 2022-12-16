import { JSONOutput } from 'typedoc';
import { debouncer } from '../../../../types/frontendTypes.js';
import yafElement from '../../../yafElement.js';
const { debounce, makeSymbolSpan, makeTypeSpan, renderSignatureType } =
	yafElement;

export class YafSignatureMapped extends HTMLElement {
	props!: JSONOutput.MappedType;

	connectedCallback() {
		if (debounce(this as debouncer)) return;

		const {
			parameter,
			parameterType,
			templateType,
			nameType,
			optionalModifier,
			readonlyModifier,
		} = this.props;
		const readonlyModifierElement = readonlyModifier
			? makeSymbolSpan(
					readonlyModifier === '+' ? 'readonly ' : '-readonly '
			  )
			: undefined;
		const nameTypeElements = nameType
			? [
					makeSymbolSpan(' as '),
					renderSignatureType(nameType, 'mappedName'),
			  ]
			: undefined;
		let colon = ': ';
		if (optionalModifier) colon = optionalModifier === '+' ? '?: ' : '-?: ';

		const HTMLElements = [
			makeSymbolSpan('{'),
			readonlyModifierElement,
			makeSymbolSpan('['),
			makeTypeSpan(parameter),
			makeSymbolSpan(' in '),
			renderSignatureType(parameterType, 'mappedParameter'),
			nameTypeElements,
			makeSymbolSpan(']'),
			makeSymbolSpan(colon),
			renderSignatureType(templateType, 'mappedTemplate'),
			makeSymbolSpan('}'),
		]
			.filter((element) => !!element)
			.flat();

		HTMLElements.forEach((element) => this.appendChild(element!));
	}
}

const yafSignatureMapped = 'yaf-signature-mapped';
customElements.define(yafSignatureMapped, YafSignatureMapped);
