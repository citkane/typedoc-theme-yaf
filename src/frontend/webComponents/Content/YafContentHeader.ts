import { YAFDataObject } from '../../../types/types.js';
import yafElement from '../../YafElement.js';
import { JSONOutput } from 'typedoc';
import { componentName } from '../../../types/frontendTypes.js';
import { YafTypeParameters } from '../Type/YafTypeParameters.js';

export class YafContentHeader extends HTMLElement {
	props!: YAFDataObject;
	connectedCallback() {
		if (yafElement.debounce(this as Record<string, unknown>)) return;

		const {
			typeParameters,
			kindString,
			name,
			is,
			flags,
			comment,
			signatures,
		} = this.props;

		const titleElement = yafElement.makeElement('h1');
		if (!is.project) {
			const kindElement = yafElement.makeKindSpan(
				kindString || 'unknown'
			);
			titleElement.appendChild(kindElement);
		}
		const nameElement = yafElement.makeNameSpan(name);

		if (typeParameters && typeParameters.length) {
			nameElement.appendChild(
				yafElement.makeElement<
					YafTypeParameters,
					YafTypeParameters['props']
				>('yaf-type-parameters', null, null, typeParameters)
			);
		}
		titleElement.appendChild(nameElement);
		titleElement.appendChild(yafElement.makeFlags(flags, comment));
		if (signatures?.length === 1) {
			signatures.forEach((signature) => {
				titleElement.appendChild(
					yafElement.makeFlags(signature.flags, signature.comment)
				);
			});
		}

		this.appendChild(titleElement);
	}
}

const yafContentHeader: componentName = 'yaf-content-header';
customElements.define(yafContentHeader, YafContentHeader);
