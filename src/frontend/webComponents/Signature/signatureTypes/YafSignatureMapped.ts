import { JSONOutput } from 'typedoc';
import yafElement from '../../../YafElement.js';

export class YafSignatureMapped extends HTMLElement {
	props!: JSONOutput.MappedType;

	connectedCallback() {
		if (yafElement.debounce(this as Record<string, unknown>)) return;
		console.log(this.props);
	}
}

const yafSignatureMapped = 'yaf-signature-mapped';
customElements.define(yafSignatureMapped, YafSignatureMapped);
