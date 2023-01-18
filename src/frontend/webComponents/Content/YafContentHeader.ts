import { componentName } from '../../../types/frontendTypes.js';
import { YAFDataObject } from '../../../types/types.js';
import { YafTypeParameters } from '../Type/YafTypeParameters.js';
import {
	makeElement,
	makeKindSpan,
	makeNameSpan,
	makeFlags,
} from '../../yafElement.js';
import { YafHTMLElement } from '../../index.js';
import { events } from '../../handlers/index.js';

const { action } = events;

export class YafContentHeader extends YafHTMLElement<YAFDataObject> {
	onConnect() {
		const {
			typeParameters,
			kindString,
			name,
			is,
			id,
			flags,
			comment,
			signatures,
		} = this.props;

		const titleHTMLElement = makeElement('h1');
		const nameHTMLElement = makeNameSpan(name);

		nameHTMLElement.onclick = () =>
			events.dispatch(action.menu.scrollTo(String(id)));

		if (!is.project)
			titleHTMLElement.appendChild(makeKindSpan(kindString || 'unknown'));
		if (typeParameters && typeParameters.length) {
			nameHTMLElement.appendChild(
				makeElement<YafTypeParameters, YafTypeParameters['props']>(
					'yaf-type-parameters',
					null,
					null,
					typeParameters
				)
			);
		}
		titleHTMLElement.appendChild(nameHTMLElement);
		titleHTMLElement.appendChild(makeFlags(flags, comment));
		if (signatures?.length === 1)
			titleHTMLElement.appendChild(
				makeFlags(signatures[0].flags, signatures[0].comment)
			);

		this.appendChild(titleHTMLElement);
	}
}

const yafContentHeader: componentName = 'yaf-content-header';
customElements.define(yafContentHeader, YafContentHeader);
