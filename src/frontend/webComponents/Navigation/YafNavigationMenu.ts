import { treeMenuBranch } from '../../../types/types.js';
import appState from '../../lib/AppState.js';
import events from '../../lib/events/eventApi.js';
import { componentName, yafEventList } from '../../../types/frontendTypes.js';
import { makeElement, scrollToAnchor } from '../../yafElement.js';
import { YafNavigationMenuBranch } from './index.js';
import { YafHTMLElement } from '../../index.js';

const { trigger } = events;

/**
 *
 */
export class YafNavigationMenu extends YafHTMLElement {
	onConnect() {
		const menuData = appState.navigationMenu;
		const navHTMLElement = makeElement('nav');
		const menuHTMLElement = makeElement('menu');

		const menuEntries = YafNavigationMenu.treeBranchSort(
			Object.values(menuData)
		).map((menuBranch) => {
			const liHTMLElement = makeElement<HTMLLIElement>('li');
			const menuItemHTMLElement = makeElement<
				YafNavigationMenuBranch,
				YafNavigationMenuBranch['props']
			>('yaf-navigation-menu-branch', null, null, menuBranch);
			menuItemHTMLElement.setAttribute('root', '');
			liHTMLElement.appendChild(menuItemHTMLElement);

			return liHTMLElement;
		});

		menuHTMLElement.appendChildren(menuEntries);
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
	private focusIndex = ({ detail }: CustomEvent) =>
		scrollToAnchor(this, `menu_${detail.target}`);

	private eventsList: yafEventList = [
		['scroll', this.recordScrollTop, this],
		[trigger.menu.scrollTo, this.focusIndex],
	];

	static treeBranchSort = (branches: treeMenuBranch[]) =>
		branches
			.sort((a, b) => b.name.localeCompare(a.name))
			.sort((a, b) => (a.kind > b.kind ? -1 : 1));
}
const yafNavigationMenu: componentName = 'yaf-navigation-menu';
customElements.define(yafNavigationMenu, YafNavigationMenu);
