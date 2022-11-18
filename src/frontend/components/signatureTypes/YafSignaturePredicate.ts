import { JSONOutput } from 'typedoc';
import { YafElement } from '../../YafElement.js';

export class YafSignaturePredicate extends YafElement {
	props!: JSONOutput.PredicateType;
	constructor() {
		super(yafSignaturePredicate);
	}
	connectedCallback() {
		if (this.debounce()) return;
		console.log(this.props);
	}
}

const yafSignaturePredicate = 'yaf-signature-predicate';
customElements.define(yafSignaturePredicate, YafSignaturePredicate);
