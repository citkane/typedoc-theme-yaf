import { componentName, YAFDataObject } from '../types';
import { YAFElement } from '../lib/YafElement.js';
import { renderTypeParametersSignature, wbr } from '../lib/utils.js';

const componentName: componentName = 'yaf-content-signature';

interface props {
	typeParameters: YAFDataObject['typeParameters'];
	flags: YAFDataObject['flags'];
	type: YAFDataObject['type'];
	defaultValue: YAFDataObject['defaultValue'];
	name: YAFDataObject['name'];
}
export class YafContentSignature extends YAFElement {
	constructor() {
		super(componentName);
	}
	shadow = this.attachShadow({ mode: 'open' });
	props = <props>this.props;
	async connectedCallback() {
		const css = await this.fetchTemplate('css');
		this.shadow.appendChild(this.makeElement(css));
		const pre = this.makeElement('<pre></pre>');
		this.appendSpanTo(wbr(this.props.name), 'name', pre);
		if (this.props.typeParameters && this.props.typeParameters.length) {
			this.appendSpanTo(
				renderTypeParametersSignature(this.props.typeParameters),
				'params',
				pre
			);
		}
		if (this.props.type) {
			const optional = this.props.flags.isOptional ? '?' : '';
			this.appendSpanTo(`${optional}: `, 'symbol', pre);
			const signatureType = this.makeSignature(this.props.type, 'none');
			pre.appendChild(signatureType);
		}

		if (this.props.defaultValue) {
			this.appendSpanTo(' = ', 'symbol', pre);
			this.appendSpanTo(this.props.defaultValue, 'value', pre);
		}
		this.shadow.appendChild(pre);
	}
}
customElements.define(componentName, YafContentSignature);
