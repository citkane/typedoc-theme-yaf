import { treeMenuBranch } from '../../types/types.js';
import { YafWidgetCounter, YafWidgetKind } from './YafWidgets.js';
import events from '../lib/events/eventApi.js';
import appState from '../lib/AppState.js';
import yafElement from '../YafElement.js';
import YafElementDrawers from '../YafElementDrawers.js';
import { componentName, DrawerElement } from '../../types/frontendTypes.js';

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
			>('yaf-navigation-menu-branch', null, null, branch);
			menuItem.setAttribute('root', '');

			menu.appendChild(menuItem);
		});
		nav.appendChild(menu);
		this.appendChild(nav);

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
	private focusIndex = ({ detail }: CustomEvent) => {
		yafElement.scrollToAnchor(this, `menu_${detail.target}`);
		const drawer = document.getElementById(`menu_${detail.target}`);
		console.log(drawer);
	};

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
export class YafNavigationMenuBranch extends HTMLElement {
	props!: treeMenuBranch;
	childCount!: number;
	drawerTrigger!: HTMLElement;
	drawerHeader!: HTMLElement;
	drawer!: HTMLElement;
	toggleShowInherited!: HTMLElement;
	drawers!: YafElementDrawers;
	get newShowInheritedState() {
		return appState.options.showInheritedMembers === 'show'
			? 'hide'
			: 'show';
	}

	constructor() {
		super();
	}
	static get observedAttributes() {
		return ['showinherited'];
	}

	attributeChangedCallback(
		name: string,
		oldValue: unknown,
		newValue: unknown
	) {
		if (!oldValue || oldValue === newValue || !this.toggleShowInherited)
			return;
		switch (name) {
			case 'showinherited':
				this.toggleShowInherited.innerText =
					this.toggleShowInherited.innerText.replace(
						yafElement.initCap(<string>newValue),
						yafElement.initCap(<string>oldValue)
					);
				this.drawer.classList.remove(<string>oldValue);
				this.drawer.classList.add(<string>newValue);

				this.drawers.heightControl.resetHeights();

				break;
		}
	}
	connectedCallback() {
		if (yafElement.debounce(this as Record<string, unknown>)) return;

		const { children, id, parentDrawerElement } = this.props;

		this.id = `menu_${id}`;
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

		this.drawers.renderDrawer();

		events.on(trigger.menu.rollMenuDown, this.drawers.openDrawer);
		events.on(trigger.menu.rollMenuUp, this.drawers.closeDrawer);
		events.on(
			trigger.options.showInheritedMembers,
			({ detail }: CustomEvent) =>
				this.setAttribute('showinherited', detail)
		);

		this.setAttribute(
			'showinherited',
			appState.options.showInheritedMembers
		);
	}

	disconnectedCallback() {
		this.drawers.drawerHasDisconnected();
		events.off(trigger.menu.rollMenuDown, this.drawers.openDrawer);
		events.off(trigger.menu.rollMenuUp, this.drawers.closeDrawer);
		events.off(
			trigger.options.showInheritedMembers,
			({ detail }: CustomEvent) =>
				this.setAttribute('showinherited', detail)
		);
	}

	private makeDrawerChildren = () => {
		if (!this.childCount) return [];

		const { children } = this.props;
		const inheritedCount = Object.values(children).filter(
			(child) => !!child.inheritedFrom
		).length;

		const newMenuElements: HTMLElement[] = YafNavigationMenu.treeBranchSort(
			Object.values(children)
		).map((branch) => this.makeBranch(branch));

		if (inheritedCount) {
			this.toggleShowInherited = yafElement.makeElement(
				'li',
				'inherited',
				`${yafElement.initCap(
					this.newShowInheritedState
				)} [${inheritedCount}] inherited members.`
			);
			this.toggleShowInherited.onclick = () => {
				appState.showInheritedMembers = this.newShowInheritedState;
				this.scrollIntoView();
			};
			newMenuElements.unshift(this.toggleShowInherited);

			this.drawer.classList.add(appState.options.showInheritedMembers);
		}

		return newMenuElements;
	};

	private makeBranch = (branch: treeMenuBranch) => {
		branch.parentDrawerElement = this;
		return yafElement.makeElement<
			YafNavigationMenuBranch,
			YafNavigationMenuBranch['props']
		>(
			'yaf-navigation-menu-branch',
			branch.inheritedFrom ? 'hide' : 'show',
			null,
			branch
		);
	};

	private makeDrawerheader = () => {
		const { query, hash, name, kind } = this.props;
		let href = `?page=${query}`;
		if (hash) href += `#${hash}`;

		const header = yafElement.makeElement(
			'span',
			this.childCount ? 'header parent' : 'header'
		);
		const headerLink = yafElement.makeLinkElement(href);
		const linkName = yafElement.makeNameSpan(name);
		const linkSymbol = yafElement.makeElement<
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
customElements.define(yafNavigationBranch, YafNavigationMenuBranch);
