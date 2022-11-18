import { componentName, YAFDataObject } from '../types.js';
import { YafElement } from '../YafElement.js';
import { JSONOutput } from 'typedoc';
import { YafFlags } from './YafFlags.js';

export class YafContentHeader extends YafElement {
	constructor() {
		super(yafContentHeader);
	}
	props!: YAFDataObject;
	connectedCallback() {
		if (this.debounce()) return;

		const {
			typeParameters,
			kindString,
			name,
			is,
			flags,
			comment,
			signatures,
		} = this.props;

		const titleElement = this.makeElement(`<h1 />`);
		if (!is.project) {
			const kindElement = this.makeSpan(kindString || 'unknown', 'kind');
			titleElement.appendChild(kindElement);
		}
		const nameElement = this.makeSpan(name, 'name');
		titleElement.appendChild(nameElement);

		if (typeParameters && typeParameters.length) {
			const parameterElement = this.makeSpan(
				this.makeTypeParams(typeParameters),
				'parameters'
			);
			titleElement.appendChild(parameterElement);
		}

		titleElement.appendChild(this.makeFlags(flags, comment));
		if (signatures?.length === 1)
			signatures.forEach((signature) => {
				titleElement.appendChild(
					this.makeFlags(signature.flags, signature.comment)
				);
			});

		this.appendChild(titleElement);
	}
	makeTypeParams(params: JSONOutput.TypeParameterReflection[]) {
		return `&lt;${params.map((param) => param.name).join(', ')}&gt;`;
	}
	makeFlags(
		flags: JSONOutput.ReflectionFlags,
		comment: JSONOutput.Comment | undefined
	) {
		const flagElement: YafFlags = this.makeElement('<yaf-flags />');
		flagElement.props = {
			flags,
			comment,
		};
		return flagElement;
	}
}

const yafContentHeader: componentName = 'yaf-content-header';
customElements.define(yafContentHeader, YafContentHeader);
