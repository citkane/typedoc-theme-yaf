import { treeBranchSort } from '../lib/utils.js';
import { componentName, treeMenuBranch } from '../../types/types.js';
import { YafElement } from '../YafElement.js';
import { YafElementDrawers } from '../YafElementDrawers.js';
import { YafWidgetCounter, YafWidgetKind } from './YafWidgets.js';

import events from '../lib/events/eventApi.js';
import appState from '../lib/AppState.js';

const { trigger } = events;

/**
 *
 */
export class YafNavigationMenu extends YafElement {
	constructor() {
		super(yafNavigationMenu);
	}
	connectedCallback() {
		const menuData = appState.navigationMenu;
		const nav = this.makeElement('nav');
		const ul = this.makeElement('ul');

		const menuEntries = treeBranchSort(Object.values(menuData));
		menuEntries.forEach((branch) => {
			const menu = this.makeElement<YafNavigationMenuBranch>(
				'yaf-navigation-menu-branch'
			);
			menu.props = branch;
			menu.setAttribute('root', '');

			ul.appendChild(menu);
		});
		nav.appendChild(ul);
		this.appendChild(nav);

		this.scrollTop = appState.drawers.menuTop();
		events.on('scroll', this.recordScrollTop, this);
	}
	disconnectedCallback() {
		events.off('scroll', this.recordScrollTop, this);
	}

	recordScrollTop() {
		appState.setDrawers.menuTop(this.scrollTop);
	}
}
const yafNavigationMenu: componentName = 'yaf-navigation-menu';
customElements.define(yafNavigationMenu, YafNavigationMenu);

/**
 *
 */
export class YafNavigationMenuBranch extends YafElementDrawers {
	props!: treeMenuBranch;
	childDrawers: YafNavigationMenuBranch[] = [];
	childCount!: number;
	drawerHeader!: HTMLElement;

	constructor() {
		super(yafNavigationBranch);
	}

	connectedCallback() {
		if (this.debounce()) return;

		const { children, id } = this.props;

		this.id = String(id);
		this.childCount = Object.keys(children).length;

		this.drawerTrigger = this.makeElement('span', 'trigger');
		this.appendChild(this.makeDrawerheader());

		this.initDrawer(
			this,
			this.makeElement('ul'),
			this.drawerTrigger,
			`menu_${this.props.id})`,
			'menu'
		);

		if (this.childCount) {
			const submenuEntries = treeBranchSort(Object.values(children));
			submenuEntries.forEach((branch) => this.addBranch(branch));
		}
		if (this.hasAttribute('root')) {
			events.on(trigger.content.rollMenuDown, this.rollMenuDown);
			events.on(trigger.content.rollMenuUp, this.rollMenuUp);
		}
		this.renderDrawer();
	}

	disconnectedCallback() {
		this.drawerHasDisconnected();
		events.off(trigger.content.rollMenuDown, this.rollMenuDown);
		events.off(trigger.content.rollMenuUp, this.rollMenuUp);
	}

	rollMenuDown = () => {
		if (this.drawerParent.classList.contains('closed'))
			this.toggleDrawerState();

		this.childDrawers.forEach((drawer) => {
			drawer.rollMenuDown();
		});
	};
	rollMenuUp = () => {
		if (this.drawerParent.classList.contains('open'))
			this.toggleDrawerState();

		this.childDrawers.forEach((drawer) => {
			drawer.rollMenuUp();
		});
	};

	private addBranch = (branch: treeMenuBranch) => {
		const menuBranch = this.makeElement<YafNavigationMenuBranch>(
			'yaf-navigation-menu-branch'
		);

		menuBranch.props = branch;

		this.drawer.appendChild(menuBranch);
		this.childDrawers.push(menuBranch);
	};

	private makeDrawerheader = () => {
		const { query, hash, name, kind } = this.props;
		let href = `?page=${query}`;
		if (hash) href += `#${hash}`;

		const header = this.makeElement(
			'span',
			this.childCount ? 'header parent' : 'header'
		);
		const headerLink = this.makeLinkElement(href);
		const linkName = this.makeNameSpan(name);
		const linkSymbol = this.makeElement<
			YafWidgetKind,
			YafWidgetKind['props']
		>('yaf-widget-kind', null, null, { kind: String(kind) });

		headerLink.appendChild(linkSymbol);
		headerLink.appendChild(linkName);
		header.appendChild(headerLink);

		if (this.childCount) return this.extendHeader(header);
		return header;
	};

	private extendHeader = (header: HTMLElement) => {
		const countWidget =
			this.makeElement<YafWidgetCounter>('yaf-widget-counter');
		countWidget.props = {
			count: this.childCount,
			fontSize: '.8rem',
		};
		const icon = this.makeElement('span', 'icon');
		icon.appendChild(this.makeIconSpan('expand_less'));

		this.drawerTrigger.appendChild(countWidget);
		this.drawerTrigger.appendChild(icon);
		header.appendChild(this.drawerTrigger);

		return header;
	};
}
const yafNavigationBranch: componentName = 'yaf-navigation-menu-branch';
customElements.define(yafNavigationBranch, YafNavigationMenuBranch);
