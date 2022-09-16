import { componentName } from '../types';
import { YAFElement } from '../lib/YafElement.js';

import { eventConstruct } from '../lib/eventApi.js';
import { JSONOutput } from 'typedoc';
import { type } from 'os';

const componentName: componentName = 'yaf-content-signature-reference';

/**
 * Renders the signature for a typedoc `ReferenceType`,
 * analogous to the typedoc
 * {@link https://github.com/TypeStrong/typedoc/blob/71fb91392feccbb0c4f9ac39d73d3a8bdc96e1f0/src/lib/output/themes/default/partials/type.tsx#L237-L277 reference} partial.
 *
 * @todo
 * - implement `renderUniquePath
 * -
 */
export class YafContentSignatureReference extends YAFElement {
	constructor() {
		super(componentName);
	}
	props = <JSONOutput.ReferenceType>this.props;
	async connectedCallback() {
		const newElement = this.makeElement(`<span class="type" />`);
		let nameElement: Element;
		if (this.props.externalUrl) {
			nameElement = this.makeElement(
				`<a class="type" href="${this.props.externalUrl}" target="_blank">${this.props.name}</a>`
			);
		} else if (this.props.id) {
			const reflection = await this.fetchReflectionById(this.props.id);
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
		} else {
			nameElement = this.makeElement(
				`<span class="type">${this.props.name}</span>`
			);
		}
		const len = this.props.typeArguments?.length;
		if (len) {
			newElement.appendChild(nameElement);
			this.appendSpanTo('<', 'symbol', newElement);
			this.props.typeArguments?.forEach((argument, i) => {
				newElement.appendChild(
					this.makeSignature(argument, 'referenceTypeArgument')
				);
				if (i < len) this.appendSpanTo(', ', 'symbol', newElement);
			});
			this.appendSpanTo('>', 'symbol', newElement);
		} else {
			newElement.appendChild(nameElement);
		}
		this.parentElement?.replaceChild(newElement, this);
	}
}
customElements.define(componentName, YafContentSignatureReference);
