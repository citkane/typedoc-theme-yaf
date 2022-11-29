import { needsParenthesis } from '../lib/utils.js';
import {
	abnormalSigTypes,
	TypeContext,
	YAFDataObject,
} from '../../types/types.js';
import { YafElement } from '../YafElement.js';

export * from './signatureTypes/index.js';

export class YafSignature extends YafElement {
	props!: {
		type: YAFDataObject['type'] | abnormalSigTypes;
		context: TypeContext;
	};
	count = 0;
	constructor() {
		super(yafSignature);
	}
	connectedCallback() {
		if (this.debounce()) return;

		let { type } = this.props;
		const { context } = this.props;
		if (!type) type = { type: 'unknown', name: 'unknown' };
		const parenthesis = needsParenthesis[type.type](context);

		const typeSignature: YafElement & {
			props: YAFDataObject['type'] | abnormalSigTypes;
		} = this.makeElement(`yaf-signature-${type.type}`);
		if (parenthesis) typeSignature.setAttribute('needsParenthesis', '');
		typeSignature.props = type;

		this.appendChild(typeSignature);
	}
}
const yafSignature = 'yaf-signature';
customElements.define(yafSignature, YafSignature);
