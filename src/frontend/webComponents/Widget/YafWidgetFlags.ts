import { JSONOutput } from 'typedoc';
import yafElement from '../../yafElement.js';

export class YafWidgetFlags extends HTMLElement {
	props!: {
		flags: string[];
		comment?: JSONOutput.Comment;
	};

	connectedCallback() {
		if (yafElement.debounce(this as Record<string, unknown>)) return;

		const { flags, comment } = this.props;

		const allFlags = [...flags, ...(comment?.modifierTags || [])];

		allFlags.forEach((flag) => {
			this.appendChild(
				yafElement.makeElement('span', 'flag', flag.replace(/^@/, ''))
			);
		});
	}
}

const yafWidgetFlags = 'yaf-widget-flags';
customElements.define(yafWidgetFlags, YafWidgetFlags);
