import { needsParenthesis } from '../lib/utils.js';
import { abnormalSigTypes, TypeContext, YAFDataObject } from '../types.js';
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

		/*
		const typeName = type.type.replace(/-\D/g, (x) => {
			return x[1].toUpperCase();
		});
		*/
		const typeSignature: YafElement & {
			props: YAFDataObject['type'] | abnormalSigTypes;
		} = this.makeElement(
			parenthesis
				? `<yaf-signature-${type.type} needsParenthesis />`
				: `<yaf-signature-${type.type} />`
		);
		typeSignature.props = type;
		//typeSignature.classList.add('signature');
		//this.parentNode?.replaceChild(typeSignature, this);
		this.appendChild(typeSignature);
	}
}
const yafSignature = 'yaf-signature';
customElements.define(yafSignature, YafSignature);

/*
makeSignature = (
	type: YAFDataObject['type'] | abnormalSigTypes,
	context: TypeContext
) => {
	if (!type) type = { type: 'unknown', name: 'unknown' };
	const parenthesis = needsParenthesis[type.type](context);
	const typeName = type.type.replace(/-\D/g, (x) => {
		return x[1].toUpperCase();
	});
	const signatureType = this.makeElement(
		parenthesis
			? `<yaf-content-signature-${typeName} needsParenthesis />`
			: `<yaf-content-signature-${typeName} />`
	);
	this.setPropsTo(signatureType, type as anyObject);
	return signatureType;
};
*/
