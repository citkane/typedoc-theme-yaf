import { JSONOutput } from 'typedoc';
import { debouncer } from '../../../../types/frontendTypes.js';
import appState from '../../../lib/AppState.js';
import yafElement from '../../../yafElement.js';
const { debounce, renderSignatureType, makeLinkElement, makeSymbolSpan } =
	yafElement;

export class YafSignatureIndexedAccess extends HTMLElement {
	props!: JSONOutput.IndexedAccessType;

	connectedCallback() {
		if (debounce(this as debouncer)) return;

		const { indexType, objectType } = this.props;

		const referenceId = (<objectWithId>objectType).id;
		const linkTheSignature =
			!!referenceId && objectType.type !== 'reference';
		const indexTypeElement = renderSignatureType(indexType, 'indexedIndex');
		const indexSignatureElement = linkTheSignature
			? YafSignatureIndexedAccess.wrapSignatureInLink(
					String(referenceId!),
					indexTypeElement
			  )
			: indexTypeElement;

		const HTMLElements = [
			renderSignatureType(objectType, 'indexedObject'),
			makeSymbolSpan('['),
			indexSignatureElement,
			makeSymbolSpan(']'),
		];

		HTMLElements.forEach((element) => this.appendChild(element));
	}

	private static wrapSignatureInLink(
		referenceId: string,
		indexTypeElement: HTMLElement
	) {
		const linkElement = makeLinkElement(
			`?page=${appState.reflectionMap[referenceId].fileName}`
		);
		linkElement.appendChild(indexTypeElement);
		return linkElement;
	}
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
type objectWithId = JSONOutput.IndexedAccessType['objectType'] & {
	id?: number;
};
