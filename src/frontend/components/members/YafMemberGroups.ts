import { DrawerElement } from '../../../types/frontendTypes.js';
import { YAFDataObject, YAFReflectionLink } from '../../../types/types.js';
import yafElement from '../../YafElement.js';
import YafElementDrawers from '../../YafElementDrawers.js';
import { YafWidgetCounter } from '../YafWidgets.js';
import { YafMember } from './YafMember.js';

/**
 *
 */
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
			this.ul.appendChild(item);
		});
		this.appendChild(this.ul);
	}
}
const yafMemberGroupLink = 'yaf-member-group-link';
customElements.define(yafMemberGroupLink, YafMemberGroupLink);

/**
 *
 */
export class YafMemberGroupReflection extends HTMLElement {
	props!: {
		title: string;
		children: YAFDataObject[];
		pageId: string;
	};
	drawers!: YafElementDrawers;

	connectedCallback() {
		if (yafElement.debounce(this as Record<string, unknown>)) return;
		const { title, children, pageId } = this.props;

		const drawer = yafElement.makeElement(`ul`);
		const drawerTrigger = yafElement.makeElement('span', 'trigger');
		const groupHeader = yafElement.makeElement('h2');
		const groupTitle = yafElement.makeTitleSpan(`${title}`);
		const handleIcon = yafElement.makeIconSpan('expand_less');
		const icon = yafElement.makeElement('span', 'icon');
		const groupCount = yafElement.makeElement<
			YafWidgetCounter,
			YafWidgetCounter['props']
		>('yaf-widget-counter', null, null, {
			count: children.length,
		});

		icon.appendChild(handleIcon);
		drawerTrigger.appendChild(icon);
		drawerTrigger.appendChild(groupTitle);
		groupHeader.appendChild(drawerTrigger);
		groupHeader.appendChild(groupCount);
		this.appendChild(groupHeader);

		children.forEach((child) => {
			const item = yafElement.makeElement('li');
			item.id = child.name;
			const member = yafElement.makeElement<
				YafMember,
				YafMember['props']
			>('yaf-member', null, null, child);
			item.appendChild(member);
			drawer.appendChild(item);
		});

		this.id = `member_${pageId}_${title}`;

		this.drawers = new YafElementDrawers(
			this as unknown as DrawerElement,
			drawer,
			drawerTrigger,
			this.id
		);
		this.drawers.renderDrawer();
	}
	disconnectedCallback() {
		this.drawers.drawerHasDisconnected();
	}
}
const yafMemberGroupReflection = 'yaf-member-group-reflection';
customElements.define(yafMemberGroupReflection, YafMemberGroupReflection);
