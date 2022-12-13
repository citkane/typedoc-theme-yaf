import { YAFDataObject } from '../../../types/types.js';
import yafElement from '../../YafElement.js';
import { abnormalSigTypes, TypeContext } from '../../../types/frontendTypes.js';
import appState from '../../lib/AppState.js';

export class YafSignature extends HTMLElement {
	props!: {
		type: YAFDataObject['type'] | abnormalSigTypes;
		context: TypeContext;
	};
	count = 0;

	connectedCallback() {
		if (yafElement.debounce(this as Record<string, unknown>)) return;

		let { type } = this.props;
		const { context } = this.props;
		if (!type) type = { type: 'unknown', name: 'unknown' };
		const parenthesis = appState.needsParenthesis[type.type][context];

		const typeSignature: HTMLElement & {
			props: YAFDataObject['type'] | abnormalSigTypes;
		} = yafElement.makeElement(
			`yaf-signature-${YafSignature.parseTypeName(type.type)}`
		);
		if (parenthesis) typeSignature.setAttribute('needsParenthesis', '');
		typeSignature.props = type;

		this.appendChild(typeSignature);
	}

	private static parseTypeName = (name: string) =>
		name.replace(/[A-Z]/g, (s) => `-${s.toLowerCase()}`);
}
const yafSignature = 'yaf-signature';
customElements.define(yafSignature, YafSignature);
