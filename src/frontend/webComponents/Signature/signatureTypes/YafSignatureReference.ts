import { componentName } from '../../../../types/frontendTypes.js';
import { JSONOutput } from 'typedoc';
import { YafTypeArguments } from '../../Type/YafTypeArguments.js';
import appState from '../../../handlers/AppState.js';
import {
	makeNameSpan,
	makeLinkElement,
	makeElement,
} from '../../../yafElement.js';
import { YafHTMLElement } from '../../../index.js';

/**
 *
 */
export class YafSignatureReference extends YafHTMLElement<JSONOutput.ReferenceType> {
	onConnect() {
		const { externalUrl, id, name, typeArguments } = this.props;
		const { factory } = YafSignatureReference;
		const fileLink = id ? appState.reflectionMap[id] : undefined;
		const fileLinkName = fileLink ? fileLink.query : undefined;

		const nameHTMLElement = externalUrl
			? factory.externalUrl(externalUrl, name)
			: fileLinkName
			? factory.fileLinkName(fileLinkName, name)
			: makeNameSpan(name);

		const HTMLElements = [
			nameHTMLElement,
			factory.typeArguments(typeArguments),
		];

		this.appendChildren(HTMLElements.flat());
	}

	private static factory = {
		renderTypeArguments: (
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
			),
		externalUrl: (externalUrl: string, name: string) => {
			const linkHTMLElement = makeLinkElement(externalUrl);
			linkHTMLElement.setAttribute('target', '_blank');
			linkHTMLElement.appendChild(makeNameSpan(name));

			return linkHTMLElement;
		},
		fileLinkName: (fileLinkName: string, name: string) => {
			const linkHTMLElement = makeLinkElement(`?page=${fileLinkName}`);
			linkHTMLElement.appendChild(makeNameSpan(name));

			return linkHTMLElement;
		},
		typeArguments: (
			typeArguments: JSONOutput.ReferenceType['typeArguments']
		) =>
			typeArguments && typeArguments.length
				? this.factory.renderTypeArguments(typeArguments)
				: undefined,
	};
}

const componentName: componentName = 'yaf-signature-reference';
customElements.define(componentName, YafSignatureReference);
