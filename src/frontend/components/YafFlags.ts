import { JSONOutput } from 'typedoc';
import { YafElement } from '../YafElement.js';

export class YafFlags extends YafElement {
	props!: {
		flags: JSONOutput.ReflectionFlags;
		comment?: JSONOutput.Comment;
	};
	constructor() {
		super(yafFlags);
	}
	connectedCallback() {
		if (this.debounce()) return;

		const { flags, comment } = this.props;

		let allFlags = Object.keys(flags).map((flag) =>
			flag.replace('is', '').replace('has', '').toLowerCase()
		);

		if (comment?.modifierTags)
			allFlags = [...allFlags, ...comment.modifierTags];

		allFlags.forEach((flag) => {
			this.appendChild(
				this.makeElement('span', 'flag', flag.replace(/^@/, ''))
			);
		});
	}
}

const yafFlags = 'yaf-flags';
customElements.define(yafFlags, YafFlags);
