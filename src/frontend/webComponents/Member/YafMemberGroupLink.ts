import { YAFReflectionLink } from '../../../types/types';
import { events } from '../../lib/index.js';
import yafElement from '../../YafElement.js';
import { YafWidgetCounter } from '../Widget/index.js';

const { action } = events;

export class YafMemberGroupLink extends HTMLElement {
	props!: {
		title: string;
		children: YAFReflectionLink[];
	};
	ul = yafElement.makeElement(`ul`);

	connectedCallback() {
		if (yafElement.debounce(this as Record<string, unknown>)) return;
		const { children, title } = this.props;
		const groupHeader = yafElement.makeElement('h2');
		const groupTitle = yafElement.makeTitleSpan(`${title}`);
		groupHeader.appendChild(groupTitle);

		const groupCount =
			yafElement.makeElement<YafWidgetCounter>('yaf-widget-counter');
		groupCount.props = {
			count: children.length,
		};
		groupHeader.appendChild(groupCount);

		this.appendChild(groupHeader);
		this.ul.classList.add('links');
		children.forEach((child) => {
			const item = yafElement.makeElement(`li`);
			const link = yafElement.makeLinkElement(
				`?page=${child.fileName}`,
				undefined,
				child.name
			);

			item.appendChild(link);
			item.onclick = () =>
				events.dispatch(action.content.scrollTo(`menu_${child.id}`));
			this.ul.appendChild(item);
		});
		this.appendChild(this.ul);
	}
}
const yafMemberGroupLink = 'yaf-member-group-link';
customElements.define(yafMemberGroupLink, YafMemberGroupLink);
