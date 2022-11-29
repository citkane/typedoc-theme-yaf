import { JSONOutput } from 'typedoc';
import { componentName } from '../../types/types.js';
import appState from '../lib/AppState.js';
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
			kind,
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
				spans.push(this.makeSymbolSpan(`${nameParts} `));

			//spans.push(this.makeSpan(`${nameParts} `, 'symbol'));

			spans.push(this.makeTitleSpan(namePart!));
			//spans.push(this.makeSpan(namePart!, 'title'));
		} else if (kind === appState.reflectionKind.ConstructorSignature) {
			spans.push(
				this.makeSymbolSpan(
					`${flags.isAbstract ? 'abstract new ' : 'new '}`
				)

				/*
				this.makeSpan(
					`${flags.isAbstract ? 'abstract new ' : 'new '}`,
					'symbol'
				)
				*/
			);
		}

		if (typeParameter) {
			const typeParams: YafTypeParameters = this.makeElement(
				'yaf-type-parameters'
			);
			typeParams.props = this.props.typeParameter
				? this.props.typeParameter
				: undefined;
			spans.push(typeParams);
		}
		spans.push(this.makeSymbolSpan('('));
		//spans.push(this.makeSpan('(', 'symbol'));
		parameters?.forEach((parameter, i) => {
			const wrapper = this.makeElement('span', 'wrapper');

			parameter.flags.isRest &&
				wrapper.appendChild(this.makeSymbolSpan('...'));
			wrapper.appendChild(this.makeNameSpan(parameter.name));

			parameter.flags.isOptional &&
				wrapper.appendChild(this.makeSymbolSpan('?'));
			parameter.defaultValue &&
				wrapper.appendChild(this.makeSymbolSpan('?'));
			wrapper.appendChild(this.makeSymbolSpan(':'));
			wrapper.appendChild(
				this.renderSignatureType(parameter.type, 'none')
			);
			i < parameters!.length - 1 &&
				wrapper.appendChild(this.makeSymbolSpan(', '));

			spans.push(wrapper);
		});
		spans.push(this.makeSymbolSpan(')'));

		if (type) {
			spans.push(this.makeSymbolSpan(`${arrowStyle ? ' => ' : ': '}`));
			spans.push(this.renderSignatureType(type, 'none'));
		}
		spans.forEach((span) => this.appendChild(span));
	}
}
const yafSignatureTitle: componentName = 'yaf-signature-title';
customElements.define(yafSignatureTitle, YafSignatureTitle);
