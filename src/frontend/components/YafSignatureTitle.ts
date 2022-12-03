import { JSONOutput } from 'typedoc';
import { componentName } from '../../types/frontendTypes.js';
import appState from '../lib/AppState.js';
import yafElement from '../YafElement.js';
import { YafTypeParameters } from './YafTypeParameters.js';

export class YafSignatureTitle extends HTMLElement {
	props!: {
		hideName?: boolean;
		arrowStyle?: boolean;
	} & JSONOutput.SignatureReflection;

	connectedCallback() {
		if (yafElement.debounce(this as Record<string, unknown>)) return;

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
				spans.push(yafElement.makeSymbolSpan(`${nameParts} `));

			//spans.push(this.makeSpan(`${nameParts} `, 'symbol'));

			spans.push(yafElement.makeTitleSpan(namePart!));
			//spans.push(this.makeSpan(namePart!, 'title'));
		} else if (kind === appState.reflectionKind.ConstructorSignature) {
			spans.push(
				yafElement.makeSymbolSpan(
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
			const typeParams: YafTypeParameters = yafElement.makeElement(
				'yaf-type-parameters'
			);
			typeParams.props = this.props.typeParameter
				? this.props.typeParameter
				: undefined;
			spans.push(typeParams);
		}
		spans.push(yafElement.makeSymbolSpan('('));
		//spans.push(this.makeSpan('(', 'symbol'));
		parameters?.forEach((parameter, i) => {
			const wrapper = yafElement.makeElement('span', 'wrapper');

			parameter.flags.isRest &&
				wrapper.appendChild(yafElement.makeSymbolSpan('...'));
			wrapper.appendChild(yafElement.makeNameSpan(parameter.name));

			parameter.flags.isOptional &&
				wrapper.appendChild(yafElement.makeSymbolSpan('?'));
			parameter.defaultValue &&
				wrapper.appendChild(yafElement.makeSymbolSpan('?'));
			wrapper.appendChild(yafElement.makeSymbolSpan(':'));
			wrapper.appendChild(
				yafElement.renderSignatureType(parameter.type, 'none')
			);
			i < parameters!.length - 1 &&
				wrapper.appendChild(yafElement.makeSymbolSpan(', '));

			spans.push(wrapper);
		});
		spans.push(yafElement.makeSymbolSpan(')'));

		if (type) {
			spans.push(
				yafElement.makeSymbolSpan(`${arrowStyle ? ' => ' : ': '}`)
			);
			spans.push(yafElement.renderSignatureType(type, 'none'));
		}
		spans.forEach((span) => this.appendChild(span));
	}
}
const yafSignatureTitle: componentName = 'yaf-signature-title';
customElements.define(yafSignatureTitle, YafSignatureTitle);
