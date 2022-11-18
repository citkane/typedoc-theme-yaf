import { JSONOutput } from 'typedoc';
import { componentName } from '../types.js';
import { YafElement } from '../YafElement.js';
import { YafTypeParameters } from './YafTypeParameters.js';

export class YafSignatureTitle extends YafElement {
	props!: {
		hideName?: boolean;
		arrowStyle?: boolean;
	} & JSONOutput.SignatureReflection;

	constructor() {
		super(yafSignatureTitle);
	}
	connectedCallback() {
		if (this.debounce()) return;

		const spans: HTMLElement[] = [];
		const {
			name,
			kindString,
			flags,
			typeParameter,
			parameters,
			type,
			hideName,
			arrowStyle,
		} = this.props;

		if (!hideName) {
			let nameParts: string | string[] = name.split(' ');
			const namePart = nameParts.pop();
			nameParts = nameParts.join(' ');

			if (nameParts.length)
				spans.push(this.makeSpan(`${nameParts} `, 'symbol'));
			spans.push(this.makeSpan(namePart!, 'title'));
		} else if (kindString === 'Constructor signature') {
			spans.push(
				this.makeSpan(
					`${flags.isAbstract ? 'abstract new ' : 'new '}`,
					'symbol'
				)
			);
		}

		if (typeParameter) {
			const typeParams: YafTypeParameters = this.makeElement(
				'<yaf-type-parameters />'
			);
			typeParams.props = this.props.typeParameter
				? this.props.typeParameter
				: undefined;
			spans.push(typeParams);
		}

		spans.push(this.makeSpan('(', 'symbol'));
		parameters?.forEach((parameter, i) => {
			const wrapper = this.makeSpan('', 'wrapper');

			parameter.flags.isRest &&
				wrapper.appendChild(this.makeSpan('...', 'symbol'));
			wrapper.appendChild(this.makeSpan(parameter.name, 'name'));

			parameter.flags.isOptional &&
				wrapper.appendChild(this.makeSpan('?', 'symbol'));
			parameter.defaultValue &&
				wrapper.appendChild(this.makeSpan('?', 'symbol'));
			wrapper.appendChild(this.makeSpan(':', 'symbol'));
			wrapper.appendChild(
				this.renderSignatureType(parameter.type, 'none')
			);
			i < parameters!.length - 1 &&
				wrapper.appendChild(this.makeSpan(', ', 'symbol'));

			spans.push(wrapper);
		});
		spans.push(this.makeSpan(')', 'symbol'));

		if (type) {
			spans.push(
				this.makeSpan(`${arrowStyle ? ' => ' : ': '}`, 'symbol')
			);
			spans.push(this.renderSignatureType(type, 'none'));
		}
		spans.forEach((span) => this.appendChild(span));
	}
}
const yafSignatureTitle: componentName = 'yaf-signature-title';
customElements.define(yafSignatureTitle, YafSignatureTitle);
