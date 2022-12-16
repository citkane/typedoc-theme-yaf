import { componentName, debouncer } from '../../../types/frontendTypes.js';
import { YAFDataObject } from '../../../types/types.js';
import { YafTypeParameters } from '../Type/YafTypeParameters.js';
import yafElement from '../../yafElement.js';
const { debounce, makeElement, makeKindSpan, makeNameSpan, makeFlags } =
	yafElement;

export class YafContentHeader extends HTMLElement {
	props!: YAFDataObject;
	connectedCallback() {
		if (debounce(this as debouncer)) return;

		const {
			typeParameters,
			kindString,
			name,
			is,
			flags,
			comment,
			signatures,
		} = this.props;
		const titleElement = makeElement('h1');
		const nameElement = makeNameSpan(name);

		if (!is.project)
			titleElement.appendChild(makeKindSpan(kindString || 'unknown'));
		if (typeParameters && typeParameters.length) {
			nameElement.appendChild(
				makeElement<YafTypeParameters, YafTypeParameters['props']>(
					'yaf-type-parameters',
					null,
					null,
					typeParameters
				)
			);
		}
		titleElement.appendChild(nameElement);
		titleElement.appendChild(makeFlags(flags, comment));
		if (signatures?.length === 1)
			titleElement.appendChild(
				makeFlags(signatures[0].flags, signatures[0].comment)
			);

		this.appendChild(titleElement);
	}
}

const yafContentHeader: componentName = 'yaf-content-header';
customElements.define(yafContentHeader, YafContentHeader);
