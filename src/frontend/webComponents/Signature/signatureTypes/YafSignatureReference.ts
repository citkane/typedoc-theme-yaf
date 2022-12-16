import { componentName, debouncer } from '../../../../types/frontendTypes.js';
import { JSONOutput } from 'typedoc';
import { YafTypeArguments } from '../../Type/YafTypeArguments.js';
import appState from '../../../lib/AppState.js';
import yafElement from '../../../yafElement.js';
const { debounce, makeNameSpan, makeLinkElement, makeElement } = yafElement;

/**
 *
 */
export class YafSignatureReference extends HTMLElement {
	props!: JSONOutput.ReferenceType;
	nameElement!: HTMLElement;

	async connectedCallback() {
		if (debounce(this as debouncer)) return;

		const { externalUrl, id, name, typeArguments } = this.props;

		const nameElement = makeNameSpan(name);
		const fileLink = id ? appState.reflectionMap[id] : undefined;
		const fileLinkName = fileLink ? fileLink.fileName : undefined;

		if (externalUrl) {
			const linkElement = makeLinkElement(externalUrl);
			linkElement.setAttribute('target', '_blank');
			linkElement.appendChild(nameElement);

			this.nameElement = linkElement;
		} else if (fileLinkName) {
			const linkElement = makeLinkElement(`?page=${fileLinkName}`);
			linkElement.appendChild(nameElement);

			this.nameElement = linkElement;
		} else {
			this.nameElement = nameElement;
		}
		const HTMLElements = [this.nameElement];
		if (typeArguments && typeArguments.length) {
			HTMLElements.push(
				YafSignatureReference.renderTypeArguments(typeArguments)
			);
		}

		HTMLElements.forEach((element) => this.appendChild(element));
	}

	private static renderTypeArguments = (
		args: JSONOutput.ReferenceType['typeArguments']
	) =>
		makeElement<YafTypeArguments, YafTypeArguments['props']>(
			'yaf-type-arguments',
			null,
			null,
			{
				args,
				context: 'referenceTypeArgument',
			}
		);
}

const componentName: componentName = 'yaf-signature-reference';
customElements.define(componentName, YafSignatureReference);
