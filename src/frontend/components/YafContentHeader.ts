import { componentName, YAFDataObject } from '../../types/types.js';
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

		const titleElement = this.makeElement('h1');
		if (!is.project) {
			const kindElement = this.makeKindSpan(kindString || 'unknown');
			titleElement.appendChild(kindElement);
		}
		const nameElement = this.makeNameSpan(name); //this.makeSpan(name, 'name');
		titleElement.appendChild(nameElement);

		if (typeParameters && typeParameters.length) {
			const parameterElement = this.makeParametersSpan(
				this.makeTypeParams(typeParameters)
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
		const flagElement = this.makeElement<YafFlags, YafFlags['props']>(
			'yaf-flags',
			null,
			null,
			{
				flags,
				comment,
			}
		);
		return flagElement;
	}
}

const yafContentHeader: componentName = 'yaf-content-header';
customElements.define(yafContentHeader, YafContentHeader);
