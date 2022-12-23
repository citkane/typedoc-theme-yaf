import { treeMenuBranch } from '../../../types/types.js';
import appState from '../../lib/AppState.js';
import events from '../../lib/events/eventApi.js';
import YafElementDrawers, { DrawerElement } from '../../YafElementDrawers.js';
import { componentName, yafEventList } from '../../../types/frontendTypes.js';
import {
	makeElement,
	normaliseFlags,
	makeLinkElement,
	makeNameSpan,
	makeIconSpan,
} from '../../yafElement.js';
import { YafNavigationMenu } from './index.js';
import {
	YafWidgetCounter,
	YafWidgetKind,
	YafWidgetTagToggle,
} from '../Widget/index.js';
import { YafHTMLElement } from '../../index.js';
const { trigger } = events;

/**
 *
 */
export class YafNavigationMenuBranch extends YafHTMLElement<treeMenuBranch> {
	drawers!: YafElementDrawers;

	onConnect() {
		const { children, id, parentDrawerElement, kind } = this.props;
		const { factory } = YafNavigationMenuBranch;

		this.id = `menu_${id}`;
		this.classList.add(appState.reflectionKind[kind].toLowerCase());

		const childCount = Object.keys(children).length;
		const drawerHTMLElement = makeElement('ul');
		const drawerTriggerHTMLElement = makeElement('span', 'trigger');
		const drawerHeaderHTMLElement = factory.makeDrawerheader(
			this.props,
			'span',
			drawerTriggerHTMLElement,
			childCount
		);
		drawerHTMLElement.replaceChildren(
			...factory.makeDrawerChildrenArray(
				drawerTriggerHTMLElement,
				childCount,
				this
			)
		);
		this.appendChildren([drawerHeaderHTMLElement, drawerHTMLElement]);

		this.drawers = new YafElementDrawers(
			this as unknown as DrawerElement,
			drawerHTMLElement,
			drawerTriggerHTMLElement,
			`menu_${id}`,
			parentDrawerElement as unknown as DrawerElement
		);
		/**
		 * NOTE: `drawers.renderDrawers()` is called from `YafNavigationMenu`.
		 * That is the root of the menu tree and propogates downwards to branches
		 * from within the `renderDrawers` method itself.
		 */

		drawerHTMLElement.prepend(factory.makeDrawerTagToggles(this.drawers));

		this.eventsList().forEach((event) => events.on(...event));
	}

	disconnectedCallback() {
		this.drawers.drawerHasDisconnected();
		this.eventsList().forEach((event) => events.off(...event));
	}

	private eventsList = (): yafEventList => [
		[trigger.menu.rollMenuDown, this.drawers.openDrawer],
		[trigger.menu.rollMenuUp, this.drawers.closeDrawer],
	];
	private static factory = {
		makeDrawerChildrenArray: (
			drawerTrigger: HTMLElement,
			childCount: number,
			self: YafNavigationMenuBranch
		) => {
			if (!childCount) return [];

			const { children } = self.props;
			const newMenuElements: HTMLElement[] =
				YafNavigationMenu.treeBranchSort(Object.values(children)).map(
					(branch) => {
						const childCount = Object.keys(branch.children).length;
						if (childCount)
							return this.factory.makeBranch(branch, self);

						const menuLiHTMLElement = this.factory.makeDrawerheader(
							branch,
							'li',
							drawerTrigger,
							childCount
						);
						menuLiHTMLElement.id = `menu_${branch.id}`;

						return menuLiHTMLElement;
					}
				);
			return newMenuElements;
		},
		makeBranch: (branch: treeMenuBranch, self: YafNavigationMenuBranch) => {
			branch.parentDrawerElement = self;

			const liHTMLElement = makeElement<HTMLLIElement>('li');
			const branchHTMLElement = makeElement<
				YafNavigationMenuBranch,
				YafNavigationMenuBranch['props']
			>(
				'yaf-navigation-menu-branch',
				normaliseFlags(branch.flags).join(' '),
				null,
				branch
			);

			liHTMLElement.appendChild(branchHTMLElement);

			return liHTMLElement;
		},
		makeDrawerheader: (
			branch: treeMenuBranch,
			wrapper: string,
			drawerTriggerHTMLElement: HTMLElement,
			childCount: number
		) => {
			const { query, hash, name, kind } = branch;
			let href = `?page=${query}`;
			if (hash) href += `#${hash}`;
			const classes = childCount
				? 'header parent'
				: `header ${normaliseFlags(branch.flags).join(' ')}`.trim();

			const headerHTMLElement = makeElement(wrapper, classes);
			const headerLinkHTMLElement = makeLinkElement(href);
			const nameHTMLElement = makeNameSpan(name);
			const linkSymbolHTMLElement = makeElement<
				YafWidgetKind,
				YafWidgetKind['props']
			>('yaf-widget-kind', null, null, { kind: String(kind) });

			headerLinkHTMLElement.appendChild(nameHTMLElement);

			headerHTMLElement.appendChildren([
				linkSymbolHTMLElement,
				headerLinkHTMLElement,
			]);

			return childCount
				? this.factory.extendHeader(
						headerHTMLElement,
						drawerTriggerHTMLElement,
						childCount
				  )
				: headerHTMLElement;
		},
		extendHeader: (
			header: HTMLElement,
			drawerTrigger: HTMLElement,
			childCount: number
		) => {
			const countWidget = makeElement<
				YafWidgetCounter,
				YafWidgetCounter['props']
			>('yaf-widget-counter', null, null, {
				count: childCount,
				fontSize: '.8rem',
			});
			const icon = makeElement('span', 'icon');
			icon.appendChild(makeIconSpan('expand_less'));

			drawerTrigger.appendChild(countWidget);
			drawerTrigger.appendChild(icon);
			header.appendChild(drawerTrigger);

			return header;
		},
		makeDrawerTagToggles: (drawers: YafElementDrawers) => {
			const toggleHTMLElement = makeElement<
				YafWidgetTagToggle,
				YafWidgetTagToggle['props']
			>('yaf-widget-tag-toggle', 'tagtoggles', null, { drawers });
			const liHTMLElement = makeElement('li');
			liHTMLElement.appendChild(toggleHTMLElement);
			return liHTMLElement;
		},
	};
}
const yafNavigationBranch: componentName = 'yaf-navigation-menu-branch';
customElements.define(yafNavigationBranch, YafNavigationMenuBranch);
