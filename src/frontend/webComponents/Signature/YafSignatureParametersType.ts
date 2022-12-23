import { componentName } from '../../../types/frontendTypes.js';
import { YafTypeParameterReflection } from '../../../types/types.js';
import { YafHTMLElement } from '../../index.js';
import { makeElement, renderSignatureType } from '../../yafElement.js';

export class YafSignatureParametersType extends YafHTMLElement<
	YafTypeParameterReflection[] | undefined
> {
	onConnect() {
		if (!this.props) return;
		this.appendChild(makeElement('h5', null, 'Type Parameters:'));
		const table = makeElement('table');
		const thead = makeElement('thead');
		const headers = makeElement('tr');
		['name', 'modifier', 'extends', 'default', 'comment'].forEach(
			(heading) => headers.appendChild(makeElement('th', null, heading))
		);
		thead.appendChild(headers);
		table.appendChild(thead);

		const tbody = makeElement('tbody');
		this.props.forEach((parameter) => {
			const { varianceModifier, name, type, text } = parameter;
			const defaultValue = parameter.default;

			const row = makeElement('tr');

			let td = makeElement('td', null, name);
			row.appendChild(td);

			td = makeElement('td', null, varianceModifier);
			row.appendChild(td);

			td = makeElement('td');
			if (type) td.appendChild(renderSignatureType(type, 'none'));
			row.appendChild(td);

			td = makeElement('td');
			if (defaultValue)
				td.appendChild(renderSignatureType(defaultValue, 'none'));
			row.appendChild(td);

			td = makeElement('td');
			if (text?.comment) td.innerHTML = text.comment;
			row.appendChild(td);

			tbody.appendChild(row);
		});
		table.appendChild(tbody);
		this.appendChild(table);
	}
}

const yafSignatureParametersType: componentName =
	'yaf-signature-parameters-type';
customElements.define(yafSignatureParametersType, YafSignatureParametersType);
