import { componentName } from '../../../../types/frontendTypes.js';
import yafElement from '../../../YafElement.js';
import { JSONOutput } from 'typedoc';
import { YafTypeArguments } from '../../Type/YafTypeArguments.js';
import appState from '../../../lib/AppState.js';

/**
 * Renders the signature for a typedoc `ReferenceType`,
 * analogous to the typedoc
 * {@link https://github.com/TypeStrong/typedoc/blob/71fb91392feccbb0c4f9ac39d73d3a8bdc96e1f0/src/lib/output/themes/default/partials/type.tsx#L237-L277 reference} partial.
 *
 * @todo
 * - implement `renderUniquePath
 * -
 */
export class YafSignatureReference extends HTMLElement {
	props!: JSONOutput.ReferenceType;
	nameElement!: HTMLElement;

	async connectedCallback() {
		if (yafElement.debounce(this as Record<string, unknown>)) return;

		const { externalUrl, id, name, typeArguments } = this.props;
		this.classList.add('type');

		const nameElement = yafElement.makeTypeSpan(name);

		if (externalUrl) {
			const linkElement = yafElement.makeLinkElement(externalUrl);
			linkElement.setAttribute('target', '_blank');
			linkElement.appendChild(nameElement);

			this.nameElement = linkElement;
		} else if (id) {
			const linkElement = yafElement.makeLinkElement(
				`?page=${appState.reflectionMap[id].fileName}`
			);
			linkElement.appendChild(nameElement);

			this.nameElement = linkElement;
		} else {
			this.nameElement = nameElement;
		}

		this.appendChild(this.nameElement);

		if (typeArguments && typeArguments.length)
			this.appendChild(
				yafElement.makeElement<
					YafTypeArguments,
					YafTypeArguments['props']
				>('yaf-type-arguments', null, null, {
					args: typeArguments,
					context: 'referenceTypeArgument',
				})
			);
	}
}

const componentName: componentName = 'yaf-signature-reference';
customElements.define(componentName, YafSignatureReference);
