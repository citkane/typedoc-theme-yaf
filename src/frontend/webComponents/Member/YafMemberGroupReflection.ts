import { JSONOutput } from 'typedoc';
import { DrawerElement } from '../../../types/frontendTypes.js';
import { YAFDataObject } from '../../../types/types.js';
import yafElement from '../../yafElement.js';
import errorHandlers from '../../lib/ErrorHandlers.js';
import YafElementDrawers from '../../YafElementDrawers.js';
import { YafWidgetCounter, YafWidgetTagToggle } from '../Widget/YafWidgets.js';
import { YafMember } from './YafMember.js';

/**
 *
 */
export class YafMemberGroupReflection extends HTMLElement {
	props!: {
		title: string;
		children: YAFDataObject[];
		pageId: string;
		nested?: boolean;
	};
	drawers!: YafElementDrawers;

	connectedCallback() {
		if (yafElement.debounce(this as Record<string, unknown>)) return;
		const { title, children, pageId, nested } = this.props;

		const drawer = yafElement.makeElement(`ul`);
		const drawerTrigger = yafElement.makeElement('span', 'trigger');
		const groupHeader = yafElement.makeElement(nested ? 'h3' : 'h2');
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
			yafElement
				.normaliseFlags(child.flags)
				.forEach((flag) => item.classList.add(flag));
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

		drawer.prepend(
			yafElement.makeElement<
				YafWidgetTagToggle,
				YafWidgetTagToggle['props']
			>(
				'li',
				'tagtoggles',
				null,
				{ drawers: this.drawers },
				'yaf-widget-tag-toggle'
			)
		);

		this.drawers.renderDrawers(true);
	}
	disconnectedCallback() {
		this.drawers.drawerHasDisconnected();
	}
	public static mapReflectionGroup = (
		group: JSONOutput.ReflectionGroup,
		children: YAFDataObject[]
	) =>
		group.children
			?.map((id) => {
				const child = children?.find((child) => child.id === id);
				!child &&
					errorHandlers.notFound(`Did not find reflection id: ${id}`);
				return child;
			})
			.filter((child) => !!child);
}
const yafMemberGroupReflection = 'yaf-member-group-reflection';
customElements.define(yafMemberGroupReflection, YafMemberGroupReflection);
