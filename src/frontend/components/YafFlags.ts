import { JSONOutput } from 'typedoc';
import yafElement from '../YafElement.js';

export class YafFlags extends HTMLElement {
	props!: {
		flags: JSONOutput.ReflectionFlags;
		comment?: JSONOutput.Comment;
	};

	connectedCallback() {
		if (yafElement.debounce(this as Record<string, unknown>)) return;

		const { flags, comment } = this.props;

		let allFlags = Object.keys(flags).map((flag) =>
			flag.replace('is', '').replace('has', '').toLowerCase()
		);

		if (comment?.modifierTags)
			allFlags = [...allFlags, ...comment.modifierTags];

		allFlags.forEach((flag) => {
			this.appendChild(
				yafElement.makeElement('span', 'flag', flag.replace(/^@/, ''))
			);
		});
	}
}

const yafFlags = 'yaf-flags';
customElements.define(yafFlags, YafFlags);
