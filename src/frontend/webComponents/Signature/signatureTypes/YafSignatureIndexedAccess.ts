import { JSONOutput } from 'typedoc';
import { YafHTMLElement } from '../../../index.js';
import appState from '../../../lib/AppState.js';
import {
	renderSignatureType,
	makeLinkElement,
	makeSymbolSpan,
} from '../../../yafElement.js';

export class YafSignatureIndexedAccess extends YafHTMLElement<JSONOutput.IndexedAccessType> {
	onConnect() {
		const { indexType, objectType } = this.props;
		const { factory } = YafSignatureIndexedAccess;

		const referenceId = (<objectWithId>objectType).id;
		const linkTheSignature =
			!!referenceId && objectType.type !== 'reference';
		const indexTypeHTMLElement = renderSignatureType(
			indexType,
			'indexedIndex'
		);
		const indexSignatureHTMLElement = linkTheSignature
			? factory.wrapSignatureInLink(
					String(referenceId!),
					indexTypeHTMLElement
			  )
			: indexTypeHTMLElement;

		const HTMLElements = [
			renderSignatureType(objectType, 'indexedObject'),
			makeSymbolSpan('['),
			indexSignatureHTMLElement,
			makeSymbolSpan(']'),
		];

		this.appendChildren(HTMLElements);
	}

	private static factory = {
		wrapSignatureInLink: (
			referenceId: string,
			indexTypeElement: HTMLElement
		) => {
			const linkElement = makeLinkElement(
				`?page=${appState.reflectionMap[referenceId].fileName}`
			);
			linkElement.appendChild(indexTypeElement);
			return linkElement;
		},
	};
}

const yafSignatureIndexedAccess = 'yaf-signature-indexed-access';
customElements.define(yafSignatureIndexedAccess, YafSignatureIndexedAccess);

/**
 * With reference to typedoc definitions: \
 * `JSONOutput.IndexedAccessType['objectType']` has an untyped `id?` property \
 * which carries from a `reference` objectType.
 *
 * This type is a hack to work with the `id` to determine the frontend url link.
 *
 * @see https://typedoc.org/api/interfaces/JSONOutput.IndexedAccessType.html
 */
export type objectWithId = JSONOutput.IndexedAccessType['objectType'] & {
	id?: number;
};
