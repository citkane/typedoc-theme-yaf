import { YafTypeParameterReflection } from '../../../types/types.js';
import yafElement from '../../yafElement.js';

export class YafSignatureParametersType extends HTMLElement {
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

const yafSignatureParametersType = 'yaf-signature-parameters-type';
customElements.define(yafSignatureParametersType, YafSignatureParametersType);
