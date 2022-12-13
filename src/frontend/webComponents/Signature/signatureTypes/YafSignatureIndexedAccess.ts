import { JSONOutput } from 'typedoc';
import appState from '../../../lib/AppState.js';
import yafElement from '../../../YafElement.js';

type objectWithId = JSONOutput.IndexedAccessType['objectType'] & {
	id?: number;
};

export class YafSignatureIndexedAccess extends HTMLElement {
	props!: JSONOutput.IndexedAccessType;
	indexTypeElement!: HTMLElement;

	connectedCallback() {
		if (yafElement.debounce(this as Record<string, unknown>)) return;
		const { indexType, objectType } = this.props;

		const nameElement = yafElement.renderSignatureType(
			objectType,
			'indexedObject'
		);
		const indexTypeElement = yafElement.renderSignatureType(
			indexType,
			'indexedIndex'
		);

		const referenceId = (<objectWithId>objectType).id;

		console.log(this.props);

		switch (!!referenceId && objectType.type !== 'reference') {
			case true:
				{
					const linkElement = yafElement.makeLinkElement(
						`?page=${appState.reflectionMap[referenceId!].fileName}`
					);
					linkElement.appendChild(indexTypeElement);
					this.indexTypeElement = linkElement;
				}
				break;
			case false:
				this.indexTypeElement = indexTypeElement;
		}

		this.appendChild(nameElement);
		this.appendChild(yafElement.makeSymbolSpan('['));
		this.appendChild(this.indexTypeElement);
		this.appendChild(yafElement.makeSymbolSpan(']'));
	}
}

const yafSignatureIndexedAccess = 'yaf-signature-indexed-access';
customElements.define(yafSignatureIndexedAccess, YafSignatureIndexedAccess);
