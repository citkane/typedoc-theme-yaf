import { YAFDataObject, YAFReflectionLink } from '../../../types/types.js';
import { YafElement } from '../../YafElement.js';
import { YafElementDrawers } from '../../YafElementDrawers.js';
import { YafWidgetCounter } from '../YafWidgets.js';
import { YafMember } from './YafMember.js';

/**
 *
 */
export class YafMemberGroupLink extends YafElement {
	props!: {
		title: string;
		children: YAFReflectionLink[];
	};

	constructor() {
		super(yafMemberGroupLink);
	}
	ul = this.makeElement(`ul`);

	connectedCallback() {
		if (this.debounce()) return;
		const { children, title } = this.props;
		const groupHeader = this.makeElement('h2');
		const groupTitle = this.makeTitleSpan(`${title}`);
		groupHeader.appendChild(groupTitle);

		const groupCount =
			this.makeElement<YafWidgetCounter>('yaf-widget-counter');
		groupCount.props = {
			count: children.length,
		};
		groupHeader.appendChild(groupCount);

		this.appendChild(groupHeader);
		this.ul.classList.add('links');
		children.forEach((child) => {
			const item = this.makeElement(`li`);
			const link = this.makeLinkElement(
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
export class YafMemberGroupReflection extends YafElementDrawers {
	props!: {
		title: string;
		children: YAFDataObject[];
	};

	constructor() {
		super(yafMemberGroupReflection);
	}

	connectedCallback() {
		if (this.debounce()) return;

		const drawer = this.makeElement(`ul`);
		const drawerTrigger = this.makeElement('span', 'trigger');
		this.initDrawer(
			this,
			drawer,
			drawerTrigger,
			this.props.title,
			'content'
		);

		const { children, title } = this.props;
		const groupHeader = this.makeElement('h2');
		const groupTitle = this.makeTitleSpan(`${title}`);
		const handleIcon = this.makeIconSpan('expand_less');
		const icon = this.makeElement('span', 'icon');
		icon.appendChild(handleIcon);

		this.drawerTrigger.appendChild(icon);
		this.drawerTrigger.appendChild(groupTitle);

		groupHeader.appendChild(this.drawerTrigger);

		const groupCount =
			this.makeElement<YafWidgetCounter>('yaf-widget-counter');
		groupCount.props = {
			count: children.length,
		};

		groupHeader.appendChild(groupCount);

		this.appendChild(groupHeader);
		children.forEach((child) => {
			const item = this.makeElement('li');
			item.id = child.name;
			const member = this.makeElement<YafMember>('yaf-member');
			member.props = child;
			item.appendChild(member);
			this.drawer.appendChild(item);
		});

		this.renderDrawer();
	}
	disconnectedCallback() {
		this.drawerHasDisconnected();
	}
}
const yafMemberGroupReflection = 'yaf-member-group-reflection';
customElements.define(yafMemberGroupReflection, YafMemberGroupReflection);
