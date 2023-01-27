import {
	drawerState,
	flagCounts,
	yafDisplayOptions,
	yafEventList,
	yafState,
} from '../types/frontendTypes.js';
import appState from './handlers/AppState.js';
import { action, events } from './handlers/index.js';

export type DrawerElement = HTMLElement & YafElementDrawers;
const { trigger } = events;
/**
 * Utility class for folding, hierarchical drawers
 */
export default class YafElementDrawers {
	drawer!: HTMLElement;
	drawerParent!: DrawerElement;
	drawerTrigger!: HTMLElement;
	drawerId!: string;
	parentDrawerElement?: DrawerElement;
	debounceResize: ReturnType<typeof setTimeout> | null = null;
	isDrawer = true;
	hasContent = false;
	drawers!: YafElementDrawers;
	childDrawers!: DrawerElement[];
	constructor(
		drawerParent: DrawerElement,
		drawer: HTMLElement,
		drawerTrigger: HTMLElement,
		id: string,
		parentDrawerElement?: DrawerElement
	) {
		this.drawer = drawer;
		this.drawerParent = drawerParent;
		this.drawerTrigger = drawerTrigger;
		this.drawerId = id;
		this.parentDrawerElement = parentDrawerElement;

		this.drawerParent.isDrawer = true;

		this.drawerParent.classList.add('yaf-parent-drawer');
		this.drawer.classList.add('yaf-drawer');
		this.drawerParent.setAttribute('data-height', '0');
		this.drawerParent.setAttribute('data-height-extra', '0');

		(<yafDisplayOptions[]>Object.keys(appState.options.display)).forEach(
			(key) => {
				this.drawerParent.setAttribute(
					key,
					appState.options.display[key]
				);
			}
		);
		this.drawerTrigger.onclick = () => this.toggleDrawerState();
		this.eventsList.forEach((event) => events.on(...event));
	}
	drawerHasDisconnected = () => {
		this.eventsList.forEach((event) => events.off(...event));
	};

	private eventsList: yafEventList = [
		['resize', () => this.heightControl.debounceReset(), window],
		[
			trigger.drawers.resetHeight,
			() => this.heightControl.resetHeights(true),
		],
		[
			trigger.options.display,
			({ detail }: CustomEvent<action['options']['display']>) => {
				const { key, value } = detail;
				this.drawerParent.setAttribute(key, value);
			},
		],
	];

	renderDrawers = (init = false) => {
		if (init && !this.isRoot) return;
		this.hasContent = !!this.drawer.innerHTML;

		this.heightControl.initDataHeight(this.drawer.clientHeight);
		this.drawerParent.classList.add('closed');
		appState.openDrawers[this.drawerId]
			? this.openDrawer()
			: this.closeDrawer();

		this.childDrawerElements.forEach((child) => {
			child.drawers.renderDrawers();
		});
		setTimeout(() => this.drawerParent.classList.add('rendered'));
	};

	openDrawer = () => {
		if (this.drawerState === 'open' || !this.hasContent) return;

		this.heightControl.updateHeightAbove(this.dataHeight);
		this.drawerParent.classList.remove('closed');
		this.drawerParent.classList.add('open');

		appState.openDrawer = this.drawerId;
	};
	closeDrawer = () => {
		if (this.drawerState === 'closed' || !this.hasContent) return;

		this.heightControl.updateHeightAbove(this.dataHeight * -1);
		this.drawerParent.classList.remove('open');
		this.drawerParent.classList.add('closed');

		appState.closeDrawer = this.drawerId;
	};
	toggleDrawerState = () => {
		this.drawerState === 'open' ? this.closeDrawer() : this.openDrawer();
	};

	heightControl = {
		initDataHeight: (clientHeight: number) => {
			this.dataHeight = this.dataHeight + clientHeight;
			this.heightControl.setMaxHeightStyle();
		},
		setMaxHeightStyle: () => {
			this.drawer.setAttribute(
				'style',
				`max-height: ${this.maxHeightPixels};`
			);
		},
		updateHeightAbove: (height: number) => {
			this.dataExtraHeight = height;
			this.heightControl.setMaxHeightStyle();
			if (this.parentDrawerElement)
				this.parentDrawerElement.drawers.heightControl.updateHeightAbove(
					height
				);
		},
		reRenderDrawers: (init = false) => {
			if (init && !this.isLeaf) return;
			if (init) this.renderDrawers(true);
			if (this.parentDrawerElement)
				this.parentDrawerElement.drawers.heightControl.reRenderDrawers();
		},
		resetHeights: (init = false) => {
			if (init && !this.isRoot) return;

			this.dataHeight = 0;
			this.dataExtraReset = 0;
			this.drawer.removeAttribute('style');
			['rendered', 'open', 'closed'].forEach((className) => {
				if (this.drawerParent.classList.contains(className))
					this.drawerParent.classList.remove(className);
			});

			this.childDrawerElements.forEach((child) => {
				child.drawers.heightControl.resetHeights();
			});
			this.renderDrawers(true);
		},
		debounceReset: () => {
			this.debounceResize && clearTimeout(this.debounceResize);
			this.debounceResize = setTimeout(() => {
				this.heightControl.resetHeights(true);
			}, 100);
		},
	};

	get dataHeight() {
		return parseFloat(this.drawerParent.getAttribute('data-height') || '0');
	}
	set dataHeight(height: number) {
		this.drawerParent.setAttribute('data-height', String(height));
	}

	get dataExtraHeight() {
		return parseFloat(
			this.drawerParent.getAttribute('data-height-extra') || '0'
		);
	}
	set dataExtraHeight(height: number) {
		this.drawerParent.setAttribute(
			'data-height-extra',
			String(this.dataExtraHeight + height)
		);
	}
	set dataExtraReset(height: number) {
		this.drawerParent.setAttribute('data-height-extra', String(height));
	}

	get maxHeightPixels() {
		return String(this.dataHeight + this.dataExtraHeight) + 'px';
	}
	get drawerState(): drawerState {
		return this.drawerParent.classList.contains('open') ? 'open' : 'closed';
	}

	get childDrawerElements() {
		if (this.childDrawers) return this.childDrawers;
		this.childDrawers = [...this.drawer.children]
			.map((element) => {
				if ('drawers' in element) return element as DrawerElement;
				const nestedDrawer = [...element.children].find(
					(childElement) => 'drawers' in childElement
				);
				return nestedDrawer || undefined;
			})
			.filter((element) => !!element) as DrawerElement[];
		return this.childDrawers;
	}
	get isRoot() {
		return !this.parentDrawerElement;
	}
	get isBranch() {
		return !!this.parentDrawerElement;
	}
	get isLeaf() {
		return !this.childDrawerElements.length;
	}
	get flagCounts(): flagCounts {
		return {
			private: this.drawer.querySelectorAll(':scope > .private').length,
			inherited: this.drawer.querySelectorAll(':scope > .inherited')
				.length,
		};
	}

	static findParentDrawers = (
		child: HTMLElement,
		parents: DrawerElement[] = []
	): DrawerElement[] => {
		const parent = child.parentElement as DrawerElement;
		if (parent && parent.isDrawer)
			parents.push(parent as unknown as DrawerElement);
		if (parent)
			return YafElementDrawers.findParentDrawers(
				parent as HTMLElement,
				parents
			);
		return parents;
	};

	static hasClosedDrawers = (drawers: DrawerElement[]) => {
		return (
			drawers.length &&
			!!drawers.find((drawer) => drawer.drawers.drawerState === 'closed')
		);
	};
}
