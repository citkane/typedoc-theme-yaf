import { DrawerElement, drawerState } from '../types/frontendTypes.js';
import appState from './lib/AppState.js';
import events from './lib/events/eventApi.js';

const { trigger, action } = events;

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
		this.hasContent = !!this.drawer.innerHTML;
		this.drawerParent.isDrawer = true;

		this.drawerParent.classList.add('yaf-parent-drawer');
		this.drawer.classList.add('yaf-drawer');
		this.drawerParent.setAttribute('data-height', '0');
		this.drawerParent.setAttribute('data-height-extra', '0');

		events.on('click', () => this.toggleDrawerState(), this.drawerTrigger);
		events.on('resize', () => this.heightControl.debounceReset(), window);
		events.on(
			trigger.drawers.initHeight,
			({ detail }: CustomEvent) =>
				this.heightControl.initDataHeight(detail),
			this.drawerParent
		);
		events.on(
			trigger.drawers.refreshHeight,
			({ detail }: CustomEvent) =>
				this.heightControl.updateHeightAbove(detail),
			this.drawerParent
		);
		events.on(
			trigger.drawers.resetHeight,
			this.heightControl.resetHeights,
			this.drawerParent
		);
	}

	renderDrawer = (refresh = false) => {
		if (!refresh) this.drawerParent.appendChild(this.drawer);

		this.heightControl.initDataHeight(this.drawer.clientHeight);

		this.drawerParent.classList.add('closed');

		appState.openDrawers[this.drawerId]
			? this.openDrawer()
			: this.closeDrawer();

		setTimeout(() => this.drawerParent.classList.add('rendered'));
	};

	drawerHasDisconnected = () => {
		events.off('click', () => this.toggleDrawerState(), this.drawerTrigger);
		events.off('resize', () => this.heightControl.debounceReset(), window);
		events.off(
			trigger.drawers.initHeight,
			({ detail }: CustomEvent) =>
				this.heightControl.initDataHeight(detail),
			this.drawerParent
		);
		events.off(
			trigger.drawers.refreshHeight,
			({ detail }: CustomEvent) =>
				this.heightControl.updateHeightAbove(detail),
			this.drawerParent
		);
		events.off(
			trigger.drawers.resetHeight,
			this.heightControl.resetHeights,
			this.drawerParent
		);
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
			if (this.isBranch)
				events.dispatch(
					action.drawers.initHeight(this.drawerParent.clientHeight),
					this.parentDrawerElement
				);
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
			if (this.isBranch)
				events.dispatch(
					action.drawers.refreshHeight(height),
					this.parentDrawerElement
				);
		},
		resetHeights: () => {
			this.dataHeight = 0;
			this.dataExtraReset = 0;
			this.drawer.removeAttribute('style');
			['rendered', 'open', 'closed'].forEach((className) =>
				this.drawerParent.classList.remove(className)
			);
			this.childDrawerElements.forEach((child) =>
				events.dispatch(action.drawers.resetHeight(), child)
			);

			this.renderDrawer(true);
		},
		debounceReset: () => {
			this.debounceResize && clearTimeout(this.debounceResize);

			if (this.isBranch) return;
			this.debounceResize = setTimeout(() => {
				this.heightControl.resetHeights();
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
		if (!this.childDrawers)
			this.childDrawers = (<DrawerElement[]>[
				...this.drawer.children,
			]).filter((child) => child.isDrawer);
		return this.childDrawers;
	}
	get isRoot() {
		return !this.parentDrawerElement;
	}
	get isLeaf() {
		return !this.childDrawerElements.length;
	}
	get isBranch() {
		return !!this.parentDrawerElement;
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
