import {
	YafParameterReflection,
	YafTypeParameterReflection,
} from '../../types.js';
import { YafElement } from '../../YafElement.js';
import { YafFlags } from '../YafFlags.js';
import { YafSignature } from '../YafSignature.js';

export class YafMemberParametersType extends YafElement {
	props!: YafTypeParameterReflection[] | undefined;
	constructor() {
		super(yafMemberParametersType);
	}
	connectedCallback() {
		if (this.debounce()) return;
		if (!this.props) return;
		this.appendChild(this.makeElement('<h5>Type Parameters:</h5>'));
		const table = this.makeElement('<table />');
		const thead = this.makeElement('<thead />');
		const headers = this.makeElement('<tr />');
		['name', 'modifier', 'extends', 'default', 'comment'].forEach(
			(heading) =>
				headers.appendChild(this.makeElement(`<th>${heading}</th>`))
		);
		thead.appendChild(headers);
		table.appendChild(thead);

		const tbody = this.makeElement('<tbody />');
		this.props.forEach((parameter) => {
			const { varianceModifier, name, type, text } = parameter;
			const defaultValue = parameter.default;

			const row = this.makeElement('<tr />');

			let td = this.makeElement('<td />');
			td.innerText = name;
			row.appendChild(td);

			td = this.makeElement('<td />');
			td.innerText = varianceModifier || '';
			row.appendChild(td);

			td = this.makeElement('<td />');
			if (type) td.appendChild(this.renderSignatureType(type, 'none'));
			row.appendChild(td);

			td = this.makeElement('<td />');
			if (defaultValue)
				td.appendChild(this.renderSignatureType(defaultValue, 'none'));
			row.appendChild(td);

			td = this.makeElement('<td />');
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

export class YafMemberParameters extends YafElement {
	props!: YafParameterReflection[] | undefined;
	constructor() {
		super(yafMemberParameters);
	}
	connectedCallback() {
		if (this.debounce()) return;
		if (!this.props) return;

		this.appendChild(this.makeElement('<h5>Parameters:</h5>'));
		const table = this.makeElement('<table />');
		const thead = this.makeElement('<thead />');

		const headers = this.makeElement('<tr />');
		['flags', 'name', 'type', 'default', 'comment'].forEach((heading) =>
			headers.appendChild(this.makeElement(`<th>${heading}</th>`))
		);
		thead.appendChild(headers);
		table.appendChild(thead);

		const tbody = this.makeElement('<tbody />');
		this.props.forEach((parameter) => {
			const row = this.makeElement('<tr />');

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
		const td = this.makeElement('<td />');
		const flagsElement: YafFlags = this.makeElement('<yaf-flags />');
		flagsElement.props = { flags, comment };
		td.appendChild(flagsElement);
		return td;
	};
	makeName = (parameter: YafParameterReflection) => {
		const { flags, name } = parameter;
		const td = this.makeElement('<td />');
		td.innerText = flags.isRest ? `...${name}` : name;
		return td;
	};
	makeType = (parameter: YafParameterReflection) => {
		const { type } = parameter;
		const td = this.makeElement('<td />');
		td.classList.add('type');

		const pre = this.makeElement('<pre />');
		pre.classList.add('highlight');

		const typeSignature: YafSignature =
			this.makeElement('<yaf-signature />');
		typeSignature.props = { type, context: 'none' };

		pre.appendChild(typeSignature);
		td.appendChild(pre);
		return td;
	};
	makeDefault = (parameter: YafParameterReflection) => {
		const { defaultValue } = parameter;
		const td = this.makeElement('<td />');
		td.innerText = defaultValue || '';
		return td;
	};
	makeComment = (parameter: YafParameterReflection) => {
		const { text } = parameter;
		const td = this.makeElement('<td />');
		if (text.comment) td.innerHTML = text.comment;
		return td;
	};
}

const yafMemberParameters = 'yaf-member-parameters';
customElements.define(yafMemberParameters, YafMemberParameters);
