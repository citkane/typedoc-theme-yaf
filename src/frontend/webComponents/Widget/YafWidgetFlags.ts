import { yafWidgetFlagsProps } from '../../../types/frontendTypes.js';
import { YafHTMLElement } from '../../index.js';
import { makeElement } from '../../yafElement.js';

export class YafWidgetFlags extends YafHTMLElement<yafWidgetFlagsProps> {
	onConnect() {
		const { flags, comment } = this.props;

		const allFlags = [...flags, ...(comment?.modifierTags || [])];

		const HTMLElements = allFlags.map((flag) =>
			makeElement('span', 'flag', flag.replace(/^@/, ''))
		);

		this.appendChildren(HTMLElements);
	}
}

const yafWidgetFlags = 'yaf-widget-flags';
customElements.define(yafWidgetFlags, YafWidgetFlags);
