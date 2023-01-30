import { DrawerElement, YafHTMLElement } from '../../index.js';
import { hierarchy } from '../../../types/types';
import appState from '../../handlers/AppState.js';
import {
	makeElement,
	makeIconSpan,
	makeLinkElement,
} from '../../yafElement.js';
import { YafElementDrawers } from '../../YafElementDrawers.js';
import { yafContentHierarchyProps } from '../../../types/frontendTypes.js';

export class YafContentHierarchy extends YafHTMLElement<yafContentHierarchyProps> {
	drawers?: YafElementDrawers;
	drawerTrigger!: HTMLElement;
	drawer = makeElement('ul');

	onConnect() {
		const { hierarchy, pageId, init } = this.props;

		const HTMLElements = hierarchy?.map((item) => {
			const isLink = !(item.isTarget || !item.linkId);
			const hasChildren = !(!item.children || !item.children.length);
			const parentLi = isLink
				? this.factory.linkLi(item)
				: this.factory.li(item);

			if (!hasChildren) return parentLi;

			const childrenLi = makeElement('li');
			childrenLi.appendChild(this.factory.hierarchy(item));

			return [parentLi, childrenLi];
		});

		if (init) this.initDrawers(pageId!);
		this.drawer.appendChildren(HTMLElements?.flat());

		init
			? this.appendChild(this.drawer)
			: this.parentElement?.replaceChild(this.drawer, this);
	}

	private initDrawers = (pageId: string) => {
		this.drawerTrigger = makeElement('h5');

		this.drawerTrigger.appendChild(makeElement('span', null, 'Hierarchy'));
		this.drawerTrigger.appendChild(makeIconSpan('expand_less'));
		this.appendChild(this.drawerTrigger);

		this.drawers = new YafElementDrawers(
			this as unknown as DrawerElement,
			this.drawer,
			this.drawerTrigger,
			`hierarchy_${pageId}`
		);
	};

	private get isOrphan() {
		const { hierarchy, init } = this.props;
		if (!hierarchy || !hierarchy.length) return true;
		return (
			init &&
			hierarchy &&
			hierarchy.length === 1 &&
			(!hierarchy[0].children || !hierarchy[0].children.length)
		);
	}

	private factory = {
		li: (item: hierarchy) =>
			makeElement('li', item.isTarget ? 'target' : null, item.name),

		linkLi: (item: hierarchy) => {
			const linkData = appState.reflectionMap[item.linkId!];
			const parentLi = makeElement('li');
			parentLi.appendChild(
				makeLinkElement(
					`?page=${linkData.query}#${linkData.hash}`,
					undefined,
					item.name
				)
			);
			return parentLi;
		},

		hierarchy: (item: hierarchy) =>
			makeElement<YafContentHierarchy, YafContentHierarchy['props']>(
				'yaf-content-hierarchy',
				null,
				null,
				{
					hierarchy: item.children,
				}
			),
	};
}

const yafContentHierarchy = 'yaf-content-hierarchy';
customElements.define(yafContentHierarchy, YafContentHierarchy);
