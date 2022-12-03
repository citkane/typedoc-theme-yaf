import { YAFDataObject } from '../../types/types.js';
import yafElement from '../YafElement.js';
import { JSONOutput } from 'typedoc';
import { componentName } from '../../types/frontendTypes.js';

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
		const nameElement = yafElement.makeNameSpan(name); //this.makeSpan(name, 'name');
		titleElement.appendChild(nameElement);

		if (typeParameters && typeParameters.length) {
			const parameterElement = yafElement.makeParametersSpan(
				this.makeTypeParams(typeParameters)
			);
			titleElement.appendChild(parameterElement);
		}

		titleElement.appendChild(yafElement.makeFlags(flags, comment));
		if (signatures?.length === 1)
			signatures.forEach((signature) => {
				titleElement.appendChild(
					yafElement.makeFlags(signature.flags, signature.comment)
				);
			});

		this.appendChild(titleElement);
	}
	makeTypeParams(params: JSONOutput.TypeParameterReflection[]) {
		return `&lt;${params.map((param) => param.name).join(', ')}&gt;`;
	}
}

const yafContentHeader: componentName = 'yaf-content-header';
customElements.define(yafContentHeader, YafContentHeader);
