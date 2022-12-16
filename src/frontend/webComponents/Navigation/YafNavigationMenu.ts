import {
	YafWidgetCounter,
	YafWidgetKind,
	YafWidgetTagToggle,
} from '../Widget/YafWidgets.js';

import { componentName, DrawerElement } from '../../../types/frontendTypes.js';
import { treeMenuBranch } from '../../../types/types.js';
import appState from '../../lib/AppState.js';
import events from '../../lib/events/eventApi.js';
import yafElement from '../../yafElement.js';
import YafElementDrawers from '../../YafElementDrawers.js';

const { trigger } = events;

/**
 *
 */
export class YafNavigationMenu extends HTMLElement {
	connectedCallback() {
		const menuData = appState.navigationMenu;
		const nav = yafElement.makeElement('nav');
		const menu = yafElement.makeElement('menu');

		const menuEntries = YafNavigationMenu.treeBranchSort(
			Object.values(menuData)
		);
		menuEntries.forEach((branch) => {
			const menuItem = yafElement.makeElement<
				YafNavigationMenuBranch,
				YafNavigationMenuBranch['props']
			>('li', null, null, branch, 'yaf-navigation-menu-branch');
			menuItem.setAttribute('root', '');

			menu.appendChild(menuItem);
		});
		nav.appendChild(menu);
		this.appendChild(nav);

		(<YafNavigationMenuBranch[]>[...menu.children]).forEach((menuItem) =>
			menuItem.drawers.renderDrawers(true)
		);

		this.scrollTop = appState.scrollTops['menu'] || 0;
		events.on('scroll', this.recordScrollTop, this);
		events.on(trigger.menu.scrollTo, this.focusIndex);
	}
	disconnectedCallback() {
		events.off('scroll', this.recordScrollTop, this);
		events.off(trigger.menu.scrollTo, this.focusIndex);
	}

	private recordScrollTop = () => {
		appState.setScrollTop('menu', this.scrollTop);
	};
	private focusIndex = ({ detail }: CustomEvent) =>
		yafElement.scrollToAnchor(this, `menu_${detail.target}`);

	static treeBranchSort = (branches: treeMenuBranch[]) =>
		branches
			.sort((a, b) => b.name.localeCompare(a.name))
			.sort((a, b) => (a.kind > b.kind ? -1 : 1));
}
const yafNavigationMenu: componentName = 'yaf-navigation-menu';
customElements.define(yafNavigationMenu, YafNavigationMenu);

/**
 *
 */
export class YafNavigationMenuBranch extends HTMLLIElement {
	props!: treeMenuBranch;
	childCount!: number;
	drawerTrigger!: HTMLElement;
	drawerHeader!: HTMLElement;
	drawer!: HTMLElement;
	toggleShowInherited!: HTMLElement;
	drawers!: YafElementDrawers;

	constructor() {
		super();
	}
	static get observedAttributes() {
		return ['showinherited'];
	}

	connectedCallback() {
		if (yafElement.debounce(this as Record<string, unknown>)) return;

		const { children, id, parentDrawerElement, kind } = this.props;

		this.id = `menu_${id}`;
		this.classList.add(appState.reflectionKind[kind].toLowerCase());

		this.childCount = Object.keys(children).length;
		this.drawer = yafElement.makeElement('ul');
		this.drawerTrigger = yafElement.makeElement('span', 'trigger');
		this.appendChild(this.makeDrawerheader());

		this.drawer.replaceChildren(...this.makeDrawerChildren());

		this.drawers = new YafElementDrawers(
			this as unknown as DrawerElement,
			this.drawer,
			this.drawerTrigger,
			`menu_${id}`,
			parentDrawerElement as unknown as DrawerElement
		);
		this.drawer.prepend(
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

		events.on(trigger.menu.rollMenuDown, this.drawers.openDrawer);
		events.on(trigger.menu.rollMenuUp, this.drawers.closeDrawer);
	}

	disconnectedCallback() {
		this.drawers.drawerHasDisconnected();
		events.off(trigger.menu.rollMenuDown, this.drawers.openDrawer);
		events.off(trigger.menu.rollMenuUp, this.drawers.closeDrawer);
	}

	private makeDrawerChildren = () => {
		if (!this.childCount) return [];

		const { children } = this.props;

		const newMenuElements: HTMLElement[] = YafNavigationMenu.treeBranchSort(
			Object.values(children)
		).map((branch) => {
			if (Object.keys(branch.children).length)
				return this.makeBranch(branch);

			const menuLi = this.makeDrawerheader(branch, 'li');
			menuLi.id = `menu_${branch.id}`;

			return menuLi;
		});
		return newMenuElements;
	};

	private makeBranch = (branch: treeMenuBranch) => {
		branch.parentDrawerElement = this;

		return yafElement.makeElement<
			YafNavigationMenuBranch,
			YafNavigationMenuBranch['props']
		>(
			'li',
			yafElement.normaliseFlags(branch.flags).join(' '),
			null,
			branch,
			'yaf-navigation-menu-branch'
		);
	};

	private makeDrawerheader = (branch = this.props, wrapper = 'span') => {
		const { query, hash, name, kind } = branch;
		const childCount = Object.keys(branch.children).length;
		let href = `?page=${query}`;
		if (hash) href += `#${hash}`;
		const classes = childCount
			? 'header parent'
			: `header ${yafElement
					.normaliseFlags(branch.flags)
					.join(' ')}`.trim();

		const header = yafElement.makeElement(wrapper, classes);
		const headerLink = yafElement.makeLinkElement(href);
		const linkName = yafElement.makeNameSpan(name);
		const linkSymbol = yafElement.makeElement<
			YafWidgetKind,
			YafWidgetKind['props']
		>('yaf-widget-kind', null, null, { kind: String(kind) });

		headerLink.appendChild(linkSymbol);
		headerLink.appendChild(linkName);
		header.appendChild(headerLink);

		if (childCount) return this.extendHeader(header);
		return header;
	};

	private extendHeader = (header: HTMLElement) => {
		const countWidget = yafElement.makeElement<
			YafWidgetCounter,
			YafWidgetCounter['props']
		>('yaf-widget-counter', null, null, {
			count: this.childCount,
			fontSize: '.8rem',
		});
		const icon = yafElement.makeElement('span', 'icon');
		icon.appendChild(yafElement.makeIconSpan('expand_less'));

		this.drawerTrigger.appendChild(countWidget);
		this.drawerTrigger.appendChild(icon);
		header.appendChild(this.drawerTrigger);

		return header;
	};
}
const yafNavigationBranch: componentName = 'yaf-navigation-menu-branch';
customElements.define(yafNavigationBranch, YafNavigationMenuBranch, {
	extends: 'li',
});
