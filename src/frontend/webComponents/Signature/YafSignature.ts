import { debouncer, TypeContext } from '../../../types/frontendTypes.js';
import { YAFDataObject } from '../../../types/types.js';
import appState from '../../lib/AppState.js';
import yafElement from '../../yafElement.js';
const { debounce, makeElement, makeNameSpan } = yafElement;

/**
 * A factory class that produces Yaf theme HTMLCustomElements for the given props.type and props.context. \
 * The class replaces itself (`this`) in the DOM with the appropriate signature type CustomElement.
 *
 * This class is best used with the helper {@link frontend.yafElement}.renderSignatureType
 *
 */
export class YafSignature extends HTMLElement {
	props!: {
		type: YAFDataObject['type'];
		context: TypeContext;
	};
	count = 0;

	connectedCallback() {
		if (debounce(this as debouncer)) return;

		const { context, type } = this.props;
		if (!type || type.type === 'unknown')
			return this.appendChild(makeNameSpan(type ? type.name : 'unknown'));

		const parenthesis = appState.needsParenthesis[type.type][context];

		const typeSignature: HTMLElement & {
			props: YAFDataObject['type'];
		} = makeElement(
			`yaf-signature-${YafSignature.parseTypeName(type.type)}`
		);
		typeSignature.props = type;
		if (parenthesis) typeSignature.setAttribute('needsParenthesis', '');

		this.parentElement?.replaceChild(typeSignature, this);
	}

	/**
	 * Transforms a TypeDoc camelCased "type name" string into a hypen seperated lowercase string
	 *
	 * @param name
	 * @returns
	 */
	private static parseTypeName = (name: string) =>
		name.replace(/[A-Z]/g, (s) => `-${s.toLowerCase()}`);
}

const yafSignature = 'yaf-signature';
customElements.define(yafSignature, YafSignature);
