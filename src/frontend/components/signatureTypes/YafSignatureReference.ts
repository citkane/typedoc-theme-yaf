import { componentName } from '../../types.js';
import { YafElement } from '../../YafElement.js';
import { JSONOutput } from 'typedoc';
import { YafSignature } from '../YafSignature.js';
import { YafTypeArguments } from '../YafTypeArguments.js';

/**
 * Renders the signature for a typedoc `ReferenceType`,
 * analogous to the typedoc
 * {@link https://github.com/TypeStrong/typedoc/blob/71fb91392feccbb0c4f9ac39d73d3a8bdc96e1f0/src/lib/output/themes/default/partials/type.tsx#L237-L277 reference} partial.
 *
 * @todo
 * - implement `renderUniquePath
 * -
 */
export class YafContentSignatureReference extends YafElement {
	constructor() {
		super(componentName);
	}
	props!: JSONOutput.ReferenceType;
	async connectedCallback() {
		if (this.debounce()) return;

		const { externalUrl, id, name } = this.props;
		this.classList.add('type');
		let nameElement: Element;
		if (externalUrl && name) {
			nameElement = this.makeElement(
				`<a href="${externalUrl}" target="_blank">${name}</a>`
			);
		} else if (name) {
			nameElement = this.makeElement(
				`<span class="type">${this.props.name}</span>`
			);
		} else if (id) {
			const reflection = await this.fetchReflectionById(id);
			if (reflection.kindString === 'Type parameter') {
				nameElement = this.makeElement(
					`<span class="type">${reflection.name}</span>`
				);
			} else {
				/**
				 * @todo renderUniquePath
				 */
				nameElement = this.makeSpan('', 'type');
				const { query, hash } = reflection.location;
				const href = hash ? `?page=${query}#${hash}` : `?page=${query}`;
				const link = this.makeElement(
					`<yaf-navigation-link href="${href}">${reflection.name}</yaf-navigation-link>`
				);
				nameElement.appendChild(link);
			}
		} else return;
		this.appendChild(nameElement);
		const typeArgs: YafTypeArguments = this.makeElement(
			'<yaf-type-arguments />'
		);
		typeArgs.props = {
			args: this.props.typeArguments,
			context: 'referenceTypeArgument',
		};
		this.appendChild(typeArgs);
	}
}

const componentName: componentName = 'yaf-signature-reference';
customElements.define(componentName, YafContentSignatureReference);
