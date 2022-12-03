import { JSONOutput } from 'typedoc';
import yafElement from '../../YafElement.js';

export class YafSignaturePredicate extends HTMLElement {
	props!: JSONOutput.PredicateType;

	connectedCallback() {
		if (yafElement.debounce(this as Record<string, unknown>)) return;
		console.log(this.props);
	}
}

const yafSignaturePredicate = 'yaf-signature-predicate';
customElements.define(yafSignaturePredicate, YafSignaturePredicate);
