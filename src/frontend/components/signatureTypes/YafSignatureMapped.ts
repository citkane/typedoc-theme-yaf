import { JSONOutput } from 'typedoc';
import { YafElement } from '../../YafElement.js';

export class YafSignatureMapped extends YafElement {
	props!: JSONOutput.MappedType;
	constructor() {
		super(yafSignatureMapped);
	}
	connectedCallback() {
		if (this.debounce()) return;
		console.log(this.props);
	}
}

const yafSignatureMapped = 'yaf-signature-mapped';
customElements.define(yafSignatureMapped, YafSignatureMapped);
