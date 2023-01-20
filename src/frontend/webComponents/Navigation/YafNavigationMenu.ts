import appState from '../../handlers/AppState.js';
import { componentName, yafEventList } from '../../../types/frontendTypes.js';
import { makeElement, scrollToAnchor } from '../../yafElement.js';
import { YafNavigationMenuBranch } from './index.js';
import { YafHTMLElement } from '../../index.js';
import { treeMenuRoot } from '../../../types/types.js';
import ErrorHandlers from '../../handlers/ErrorHandlers.js';
import { action, events } from '../../handlers/index.js';

const { trigger, action } = events;

/**
 *
 */
export class YafNavigationMenu extends YafHTMLElement {
	onConnect() {
		const menuData = appState.navigationMenu;
		const navHTMLElement = makeElement('nav');
		const menuHTMLElement = makeElement('menu');

		const sortedBranches = YafNavigationMenu.treeBranchSort(menuData);
		const { links, tree } = sortedBranches;

		const listHTMLElements = links.map((link) => {
			if (link.kind === appState.reflectionKind.Project) return undefined;
			const liHTMLElement = makeElement<HTMLLIElement>('li');
			const menuItemHTMLElement = makeElement<
				YafNavigationMenuBranch,
				YafNavigationMenuBranch['props']
			>('yaf-navigation-menu-branch', null, null, {
				link,
				branch: tree[link.id],
			});
			menuItemHTMLElement.setAttribute('root', '');
			liHTMLElement.appendChild(menuItemHTMLElement);

			return liHTMLElement;
		});

		menuHTMLElement.appendChildren(listHTMLElements);
		navHTMLElement.appendChild(menuHTMLElement);
		this.appendChild(navHTMLElement);

		/**
		 * NOTE: Calls `renderDrawers()` from the root of the drawer tree only.
		 */
		(<YafNavigationMenuBranch[]>[...menuHTMLElement.children]).forEach(
			(menuItem) => {
				const drawer = [...menuItem.children].find(
					(child) => 'drawers' in child
				);
				(drawer as YafNavigationMenuBranch).drawers.renderDrawers();
			}
		);

		this.scrollTop = appState.scrollTops['menu'] || 0;
		this.eventsList.forEach((event) => events.on(...event));
	}
	disconnectedCallback() {
		this.eventsList.forEach((event) => events.off(...event));
	}

	private recordScrollTop = () => {
		appState.setScrollTop('menu', this.scrollTop);
	};
	private focusIndex = ({
		detail,
	}: CustomEvent<action['menu']['scrollTo']>) => {
		events.dispatch(action.menu.toggle('open'));
		scrollToAnchor(this, `menu_${detail.target}`);
	};

	private eventsList: yafEventList = [
		['scroll', this.recordScrollTop, this],
		[trigger.menu.scrollTo, this.focusIndex],
	];

	static treeBranchSort = (tree: treeMenuRoot) => {
		const branchLinkList = Object.keys(tree)
			.map((id) => {
				const reflectionLink = appState.reflectionMap[id];
				if (!reflectionLink)
					ErrorHandlers.notFound(
						`id "${id}" not found on reflectionMap`
					);
				return reflectionLink;
			})
			.filter((reflectionLink) => !!reflectionLink);
		const sortedBranchLinkList = branchLinkList
			.sort((a, b) => b.name.localeCompare(a.name))
			.sort((a, b) => (a.kind > b.kind ? -1 : 1));

		return { links: sortedBranchLinkList, tree };
	};
}
const yafNavigationMenu: componentName = 'yaf-navigation-menu';
customElements.define(yafNavigationMenu, YafNavigationMenu);
