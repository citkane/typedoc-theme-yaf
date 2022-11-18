import { ObjectConstant } from '../../examples/variables.js';
import { trigger } from '../lib/eventApi.js';
import { treeBranchSort } from '../lib/utils.js';
import { componentName, treeMenuBranch, treeMenuRoot } from '../types.js';
import { YafElement } from '../YafElement.js';
import { YafElementDrawers } from '../YafElementDrawers.js';
import { YafNavigationLink } from './YafNavigationLink.js';
import { YafWidgetCounter, YafWidgetKind } from './YafWidgets.js';

/**
 *
 */
export class YafNavigationMenu extends YafElement {
	constructor() {
		super(yafNavigationMenu);
	}
	async connectedCallback() {
		const menuData = await this.fetchData<treeMenuRoot>(
			'yafNavigationMenu'
		);
		const nav = this.makeElement('<nav />');
		const ul = this.makeElement('<ul />');

		const menuEntries = treeBranchSort(Object.values(menuData));
		menuEntries.forEach((branch) => {
			const menu = this.makeElement<YafNavigationMenuBranch>(
				'<yaf-navigation-menu-branch root />'
			);
			menu.props = branch;
			ul.appendChild(menu);
		});
		nav.appendChild(ul);
		this.appendChild(nav);

		this.scrollTop = window.yaf.menuState.scrollTop || 0;
		this.addEventListener('scroll', this.recordScrollTop);
	}
	disconnectedCallback() {
		this.removeEventListener('scroll', this.recordScrollTop);
	}
	recordScrollTop() {
		window.yaf.menuState.scrollTop = this.scrollTop;
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
	constructor() {
		super(yafNavigationBranch);

		const drawer = this.makeElement('<ul />');
		const drawerParent = this.makeElement('<li />');
		const drawerTrigger = this.makeSpan('', 'trigger');

		this.drawerInit(
			drawerParent,
			drawer,
			drawerTrigger,
			this.props.id,
			'menu'
		);
	}

	connectedCallback() {
		if (this.debounce()) return;

		const { query, hash, children, name, kind } = this.props;

		const header = this.makeSpan('', 'header');
		const headerLink = this.makeHeaderLink(
			this.makeHref(query, hash),
			name,
			kind
		);
		header.appendChild(headerLink);
		this.drawerParent.appendChild(header);

		const childCount = Object.keys(children).length;
		if (childCount) {
			this.extendHeader(childCount, header);
			const submenuEntries = treeBranchSort(Object.values(children));
			submenuEntries.forEach((branch) => this.addBranch(branch));
		}

		this.parentNode?.replaceChild(this.drawerParent, this);

		if (childCount) {
			this.drawerHasConnected();
		}
		if (this.hasAttribute('root')) {
			this.body.addEventListener(
				trigger.content.rollMenuDown,
				this.rollMenuDown
			);
			this.body.addEventListener(
				trigger.content.rollMenuUp,
				this.rollMenuUp
			);
		}
	}

	disconnectedCallback() {
		this.drawerHasDisconnected();
		this.body.removeEventListener(
			trigger.content.rollMenuDown,
			this.rollMenuDown
		);
		this.body.removeEventListener(
			trigger.content.rollMenuUp,
			this.rollMenuUp
		);
	}
	rollMenuDown = () => {
		if (this.drawerParent.classList.contains('closed'))
			this.drawerToggleState();

		this.childDrawers.forEach((drawer) => {
			drawer.rollMenuDown();
		});
	};
	rollMenuUp = () => {
		if (this.drawerParent.classList.contains('open'))
			this.drawerToggleState();

		this.childDrawers.forEach((drawer) => {
			drawer.rollMenuUp();
		});
	};

	private makeHref = (query: string, hash: string) => {
		let href = `?page=${query}`;
		if (hash) href += `#${hash}`;
		return href;
	};
	private makeHeaderLink = (
		href: string,
		name: string,
		kind: number | undefined
	): HTMLElement => {
		const link = this.makeElement<YafNavigationLink>(
			'<yaf-navigation-link />'
		);
		link.setAttribute('href', href);
		const linkName = this.makeSpan(name, 'name');
		link.appendChild(linkName);

		if (typeof kind !== undefined) {
			const linkWrapper = this.makeSpan('', 'wrapper');
			if (Object.keys(this.props.children).length)
				linkWrapper.onclick = () => this.drawerToggleState('open');
			const linkSymbol = this.makeElement<YafWidgetKind>(
				`<yaf-widget-kind kind="${kind}" />`
			);
			linkWrapper.appendChild(linkSymbol);
			linkWrapper.appendChild(link);
			return linkWrapper;
		} else {
			return link;
		}
	};
	private extendHeader = (childCount: number, header: HTMLElement) => {
		const countWidget = this.makeElement<YafWidgetCounter>(
			'<yaf-widget-counter />'
		);
		countWidget.props = {
			count: childCount,
			fontSize: '.8rem',
		};
		const icon = this.makeSpan('', 'icon');
		icon.appendChild(this.makeIcon('expand_less'));

		this.drawerTrigger.appendChild(countWidget);
		this.drawerTrigger.appendChild(icon);
		header.appendChild(this.drawerTrigger);
	};
	private addBranch = (branch: treeMenuBranch) => {
		const menuBranch = this.makeElement<YafNavigationMenuBranch>(
			Object.keys(branch.children).length
				? '<yaf-navigation-menu-branch />'
				: '<yaf-navigation-menu-branch leaf />'
		);
		menuBranch.props = branch;
		menuBranch.parentDrawer = this;

		this.drawer.appendChild(menuBranch);
		this.childDrawers.push(menuBranch);
	};
}
const yafNavigationBranch: componentName = 'yaf-navigation-menu-branch';
customElements.define(yafNavigationBranch, YafNavigationMenuBranch);
