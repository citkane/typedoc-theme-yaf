import {
	YafParameterReflection,
	YafTypeParameterReflection,
} from '../../../types/types.js';
import yafElement from '../../YafElement.js';
import { YafFlags } from '../YafFlags.js';
import { YafSignature } from '../YafSignature.js';

export class YafMemberParametersType extends HTMLElement {
	props!: YafTypeParameterReflection[] | undefined;

	connectedCallback() {
		if (yafElement.debounce(this as Record<string, unknown>)) return;
		if (!this.props) return;
		this.appendChild(
			yafElement.makeElement('h5', null, 'Type Parameters:')
		);
		const table = yafElement.makeElement('table');
		const thead = yafElement.makeElement('thead');
		const headers = yafElement.makeElement('tr');
		['name', 'modifier', 'extends', 'default', 'comment'].forEach(
			(heading) =>
				headers.appendChild(yafElement.makeElement('th', null, heading))
		);
		thead.appendChild(headers);
		table.appendChild(thead);

		const tbody = yafElement.makeElement('tbody');
		this.props.forEach((parameter) => {
			const { varianceModifier, name, type, text } = parameter;
			const defaultValue = parameter.default;

			const row = yafElement.makeElement('tr');

			let td = yafElement.makeElement('td', null, name);
			row.appendChild(td);

			td = yafElement.makeElement('td', null, varianceModifier);
			row.appendChild(td);

			td = yafElement.makeElement('td');
			if (type)
				td.appendChild(yafElement.renderSignatureType(type, 'none'));
			row.appendChild(td);

			td = yafElement.makeElement('td');
			if (defaultValue)
				td.appendChild(
					yafElement.renderSignatureType(defaultValue, 'none')
				);
			row.appendChild(td);

			td = yafElement.makeElement('td');
			if (text?.comment) td.innerHTML = text.comment;
			row.appendChild(td);

			tbody.appendChild(row);
		});
		table.appendChild(tbody);
		this.appendChild(table);
	}
}

const yafMemberParametersType = 'yaf-member-parameters-type';
customElements.define(yafMemberParametersType, YafMemberParametersType);

export class YafMemberParameters extends HTMLElement {
	props!: YafParameterReflection[] | undefined;

	connectedCallback() {
		if (yafElement.debounce(this as Record<string, unknown>)) return;
		if (!this.props) return;

		this.appendChild(yafElement.makeElement('h5', null, 'Parameters:'));
		const table = yafElement.makeElement('table');
		const thead = yafElement.makeElement('thead');

		const headers = yafElement.makeElement('tr');
		['flags', 'name', 'type', 'default', 'comment'].forEach((heading) =>
			headers.appendChild(yafElement.makeElement('th', null, heading))
		);
		thead.appendChild(headers);
		table.appendChild(thead);

		const tbody = yafElement.makeElement('tbody');
		this.props.forEach((parameter) => {
			const row = yafElement.makeElement('tr');

			row.appendChild(this.makeFlags(parameter));
			row.appendChild(this.makeName(parameter));
			row.appendChild(this.makeType(parameter));
			row.appendChild(this.makeDefault(parameter));
			row.appendChild(this.makeComment(parameter));

			tbody.appendChild(row);
		});
		table.appendChild(tbody);
		this.appendChild(table);

		this.appendChild(table);
	}
	makeFlags = (parameter: YafParameterReflection) => {
		const { flags, comment } = parameter;
		const td = yafElement.makeElement('td');
		const flagsElement: YafFlags = yafElement.makeElement('yaf-flags');
		flagsElement.props = { flags, comment };
		td.appendChild(flagsElement);
		return td;
	};
	makeName = (parameter: YafParameterReflection) => {
		const { flags, name } = parameter;
		const td = yafElement.makeElement(
			'td',
			null,
			flags.isRest ? `...${name}` : name
		);
		return td;
	};
	makeType = (parameter: YafParameterReflection) => {
		const { type } = parameter;

		const td = yafElement.makeElement('td', 'type');
		const pre = yafElement.makeElement('pre', 'highlight');

		const typeSignature =
			yafElement.makeElement<YafSignature>('yaf-signature');
		typeSignature.props = { type, context: 'none' };

		pre.appendChild(typeSignature);
		td.appendChild(pre);

		return td;
	};
	makeDefault = (parameter: YafParameterReflection) => {
		const { defaultValue } = parameter;
		const td = yafElement.makeElement('td', null, defaultValue);

		return td;
	};
	makeComment = (parameter: YafParameterReflection) => {
		const { text } = parameter;
		const td = yafElement.makeElement('td');
		if (text.comment) td.innerHTML = text.comment;

		return td;
	};
}

const yafMemberParameters = 'yaf-member-parameters';
customElements.define(yafMemberParameters, YafMemberParameters);
