import { treeMenuBranch, YAFReflectionLink } from '../../../types/types.js';
import appState from '../../handlers/AppState.js';
import { YafElementDrawers } from '../../YafElementDrawers.js';
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
import { DrawerElement, YafHTMLElement } from '../../index.js';
import { events } from '../../handlers/index.js';
const { trigger } = events;

/**
 *
 */
export class YafNavigationMenuBranch extends YafHTMLElement<{
	link: YAFReflectionLink;
	branch: treeMenuBranch;
	parentDrawerElement?: HTMLElement;
}> {
	drawers!: YafElementDrawers;

	onConnect() {
		const { children } = this.props.branch;
		const { kind, id } = this.props.link;
		const { parentDrawerElement } = this.props;
		const { factory } = YafNavigationMenuBranch;

		this.id = `menu_${id}`;
		this.classList.add(appState.reflectionKind[kind].toLowerCase());

		const childCount = Object.keys(children).length;

		const drawerTriggerHTMLElement = makeElement('span', 'trigger');
		const drawerHeaderHTMLElement = factory.makeDrawerheader(
			this.props.link,
			'span',
			drawerTriggerHTMLElement,
			childCount
		);
		if (childCount) {
			const drawerHTMLElement = makeElement('ul');
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
			 * That is the root of the menu tree and propagates downwards to branches
			 * from within the `renderDrawers` method itself.
			 */

			drawerHTMLElement.prepend(
				factory.makeDrawerTagToggles(this.drawers)
			);
		} else {
			this.appendChild(drawerHeaderHTMLElement);
		}

		this.eventsList().forEach((event) => events.on(...event));
	}

	disconnectedCallback() {
		this.drawers.drawerHasDisconnected();
		this.eventsList().forEach((event) => events.off(...event));
	}

	private eventsList = (): yafEventList => [
		[trigger.menu.rollMenuDown, this.drawers?.openDrawer],
		[trigger.menu.rollMenuUp, this.drawers?.closeDrawer],
	];
	private static factory = {
		makeDrawerChildrenArray: (
			drawerTrigger: HTMLElement,
			childCount: number,
			self: YafNavigationMenuBranch
		) => {
			if (!childCount) return [];

			const { children } = self.props.branch;
			const sortedBranches = YafNavigationMenu.treeBranchSort(children);
			const { links, tree } = sortedBranches;
			const newMenuElements: HTMLElement[] = links.map((link) => {
				const childCount = Object.keys(tree[link.id].children).length;

				const menuLiHTMLElement = this.factory.makeDrawerheader(
					link,
					'li',
					drawerTrigger,
					childCount
				);
				if (childCount) {
					return this.factory.makeBranch(
						tree[link.id],
						link,
						self,
						menuLiHTMLElement
					);
				}
				menuLiHTMLElement.id = `menu_${link.id}`;

				return menuLiHTMLElement;
			});
			return newMenuElements;
		},
		makeBranch: (
			branch: treeMenuBranch,
			link: YAFReflectionLink,
			self: YafNavigationMenuBranch,
			liHTMLElement: HTMLElement
		) => {
			//const liHTMLElement = makeElement<HTMLLIElement>('li');
			const branchHTMLElement = makeElement<
				YafNavigationMenuBranch,
				YafNavigationMenuBranch['props']
			>(
				'yaf-navigation-menu-branch',
				normaliseFlags(self.props.link.flags).join(' '),
				null,
				{ branch, link, parentDrawerElement: self }
			);

			liHTMLElement.appendChild(branchHTMLElement);

			return liHTMLElement;
		},
		makeDrawerheader: (
			reflectionLink: YAFReflectionLink,
			wrapper: string,
			drawerTriggerHTMLElement: HTMLElement,
			childCount: number
		) => {
			const { query, hash, name, kind, flags } = reflectionLink;
			const flagClasses = normaliseFlags(flags).join(' ').trim();
			const isBranchList = wrapper === 'li' && childCount;
			let href = `?page=${query}`;
			if (hash) href += `#${hash}`;
			const classes = isBranchList
				? flagClasses
				: childCount
				? 'header parent'
				: `header ${flagClasses}`;

			const headerHTMLElement = makeElement(wrapper, classes);

			if (isBranchList) return headerHTMLElement;

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

			if (!childCount) return headerHTMLElement;

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
			>('yaf-widget-tag-toggle', 'tagtoggles', null, {
				flagCounts: drawers.flagCounts,
			});
			const liHTMLElement = makeElement('li');
			liHTMLElement.appendChild(toggleHTMLElement);
			return liHTMLElement;
		},
	};
}
const yafNavigationBranch: componentName = 'yaf-navigation-menu-branch';
customElements.define(yafNavigationBranch, YafNavigationMenuBranch);
