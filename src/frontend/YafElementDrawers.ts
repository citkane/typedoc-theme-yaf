import { componentName, drawerContext, drawerState } from '../types/types.js';
import events from './lib/events/eventApi.js';
import appState from './lib/AppState.js';
import { YafElement } from './YafElement.js';

export class YafElementDrawers extends YafElement {
	drawer!: HTMLElement;
	drawerParent!: HTMLElement;
	drawerTrigger!: HTMLElement;

	parentDrawerElement?: YafElementDrawers;
	childDrawers?: YafElementDrawers[];

	debounceResize: ReturnType<typeof setTimeout> | null = null;
	drawerId!: string;
	context!: drawerContext;
	pageContentId?: string;

	is = 'yafElementDrawer';

	constructor(componentName: componentName) {
		super(componentName);
	}

	initDrawer = (
		drawerParent: HTMLElement,
		drawer: HTMLElement,
		drawerTrigger: HTMLElement,
		id = '',
		context: drawerContext = null
	) => {
		this.drawer = drawer;
		this.drawerParent = drawerParent;
		this.drawerTrigger = drawerTrigger;
		this.drawerId = id;
		this.context = context;
		this.parentDrawerElement = this.findParentDrawer();

		this.drawerParent.classList.add('yaf-parent-drawer');
		this.drawerParent.classList.add('closed');
		this.drawer.classList.add('yaf-drawer');

		this.drawerParent.setAttribute('data-height', '0');
		this.drawerParent.setAttribute('data-height-extra', '0');

		events.on('click', () => this.toggleDrawerState(), this.drawerTrigger);
		//events.on('resize', () => this.drawerUpdateMaxHeight(), window);
	};

	renderDrawer = () => {
		this.drawerParent.appendChild(this.drawer);

		this.heightControl.initDataHeight();

		let initDrawerState: drawerState = 'closed';
		if (this.isMenu) initDrawerState = appState.drawers.menu(this.drawerId);
		if (this.isContent)
			initDrawerState = appState.drawers.content(
				this.pageContentId!,
				this.drawerId
			);

		//console.log(initDrawerState);
		initDrawerState === 'open' ? this.openDrawer() : this.closeDrawer();
	};
	drawerHasDisconnected = () => {
		events.off('click', () => this.toggleDrawerState(), this.drawerTrigger);
		//events.off('resize', () => this.drawerUpdateMaxHeight(), window);
	};

	openDrawer = () => {
		if (this.drawerState === 'open') return;

		this.heightControl.updateHeightTree(this.dataHeight);
		//this.parentDrawerElement?.openDrawer();
		this.classList.remove('closed');
		this.classList.add('open');

		this.saveDrawerState('open');
	};
	closeDrawer = () => {
		if (this.drawerState === 'closed') return;

		this.heightControl.updateHeightTree(this.dataHeight * -1);
		this.classList.remove('open');
		this.classList.add('closed');

		this.saveDrawerState('closed');
	};
	toggleDrawerState = () => {
		this.drawerState === 'open' ? this.closeDrawer() : this.openDrawer();
	};

	heightControl = {
		initDataHeight: () => {
			if (this.parentDrawerElement) {
				const parentHeight = this.parentDrawerElement.dataHeight;
				this.parentDrawerElement.dataHeight =
					parentHeight + this.clientHeight;
			} else if (!this.hasChildren) {
				this.dataHeight = this.clientHeight;
				console.log(this.clientHeight, this.dataHeight, this);
			}
			this.heightControl.setMaxHeightStyle();
		},
		setMaxHeightStyle: () => {
			this.drawer.setAttribute(
				'style',
				`max-height: ${this.maxHeightPixels};`
			);
		},
		updateHeightTree: (height: number) => {
			this.dataExtraHeight = height;
			this.heightControl.setMaxHeightStyle();
			if (this.parentDrawerElement)
				this.parentDrawerElement.heightControl.updateHeightTree(height);
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
	get maxHeightPixels() {
		return String(this.dataHeight + this.dataExtraHeight) + 'px';
	}

	get drawerState(): drawerState {
		return this.drawerParent.classList.contains('open') ? 'open' : 'closed';
	}

	get hasChildren() {
		return this.childDrawers && this.childDrawers?.length > 0;
	}
	get isMenu() {
		return this.context === 'menu';
	}
	get isContent() {
		return this.context === 'content';
	}

	private findParentDrawer = (
		element: HTMLElement | YafElementDrawers = this.drawerParent
	): YafElementDrawers | undefined => {
		const parent = element.parentElement;
		if (!parent) return;
		if ((<YafElementDrawers>parent).is === 'yafElementDrawer')
			return parent as YafElementDrawers;

		return this.findParentDrawer(parent);
	};

	private saveDrawerState = (state: drawerState) => {
		if (this.isMenu) appState.setDrawers.menu(this.drawerId, state);
		if (this.isContent)
			appState.setDrawers.content(
				this.pageContentId!,
				this.drawerId,
				state
			);
	};
}

/*
	drawerHasConnected = () => {
		//this.drawerSetMaxHeight();
		//this.allDrawersSetHeight();

		this.childDrawers = (<YafElementDrawers[]>(
			(<unknown>[...this.drawer.childNodes])
		)).filter((child) => child.is === 'yafElementDrawer');

		if (!this.hasChildren) this.heightControl.setDataHeight();

		switch (this.context) {
			case null:
				this.drawerSetState('closed');
				break;
			case 'menu':
				this.drawerSetState(appState.getMenuDrawer(this.drawerId));
				break;
			case 'content':
				!this.pageContentId
					? events.dispatch(
							events.action.get.pageContentId(
								this.setContentDrawerState
							)
					  )
					: this.setContentDrawerState(this.pageContentId);
				break;
		}

		this.drawerParent.appendChild(this.drawer);

		setTimeout(() => {
			this.drawerParent.classList.add('rendered');
		});
	};



	heightControl = {
		setDataHeight: () => {
			if (this.parentDrawer) {
				this.drawerSetState('closed', false);
				const parentHeight = parseFloat(
					this.parentDrawer.getAttribute('data-height')!
				);
				this.parentDrawer.setAttribute(
					'data-height',
					String(parentHeight + this.clientHeight)
				);
				this.parentDrawer.heightControl.setDataHeight();
			}
			this.heightControl.setMaxHeight();
		},
		adjustExtraHeight: (height: number) => {
			let baseHeight = parseFloat(
				this.drawerParent.getAttribute('data-height-extra')!
			);
			baseHeight += height;
			this.drawerParent.setAttribute(
				'data-height-extra',
				String(baseHeight)
			);
		},

		setMaxHeight: (state?: drawerState) => {
			switch (state) {
				case 'open':
					this.heightControl.adjustExtraHeight(
						this.heightControl.getTotalHeight()
					);
					break;
				case 'closed':
					this.heightControl.adjustExtraHeight(
						this.heightControl.getTotalHeight() * -1
					);
					break;
				default:
					this.drawer.setAttribute(
						'style',
						`max-height: ${this.heightControl.getTotalHeight()}px;`
					);
			}
		},
		getTotalHeight: () => {
			const height = parseFloat(
				this.drawerParent.getAttribute('data-height') || '0'
			);
			const extraHeight = parseFloat(
				this.drawerParent.getAttribute('data-height-extra') || '0'
			);
			return height + extraHeight;
		},
	};

	private drawerSetState(drawerState: drawerState, saveState = true) {
		if (this.drawerParent.classList.contains(drawerState)) return;

		//this.parentDrawer?.heightControl.setMaxHeight(drawerState);
		this.drawerParent.classList.remove(
			drawerState === 'open' ? 'closed' : 'open'
		);

		this.drawerParent.classList.add(drawerState);

		if (!saveState) return;

		switch (this.context) {
			case 'menu':
				appState.setMenuDrawer(this.drawerId, drawerState);
				break;
			case 'content':
				appState.setContentDrawer(
					this.pageContentId!,
					this.drawerId,
					drawerState
				);
				break;
		}
	}
	drawerToggleState = (drawerState?: drawerState) => {
		const newState = this.drawerParent.classList.contains('open')
			? 'closed'
			: 'open';

		if (drawerState && drawerState !== newState) return;

		const adjustParentHeight =
			Number(this.drawerParent.getAttribute('data-height')) *
			(newState === 'open' ? 1 : -1);
		this.drawerUpdateParents(adjustParentHeight);

		this.drawerSetState(newState);
	};

	drawerSetMaxHeight = (moreHeight = 0) => {
		let height = Number(
			this.drawerParent.getAttribute('data-height') ||
				this.drawer.clientHeight
		);
		const exMoreHeight = Number(
			this.drawerParent.getAttribute('data-moreheight') || 0
		);
		moreHeight += exMoreHeight;
		height += moreHeight;

		this.drawer.setAttribute('style', `max-height: ${height}px;`);
		this.drawerParent.setAttribute(
			'data-moreheight',
			moreHeight.toString()
		);

		!moreHeight &&
			this.drawerParent.setAttribute('data-height', height.toString());
	};
	drawerUpdateMaxHeight = () => {
		this.debounceResize && clearTimeout(this.debounceResize);
		this.debounceResize = setTimeout(() => {
			const isClosed = this.drawerParent.classList.contains('closed');

			this.drawerParent.classList.remove('rendered');
			this.drawer.removeAttribute('style');
			this.drawerParent.classList.remove('closed');

			this.drawerSetMaxHeight();
			isClosed && this.drawerSetState('closed');
			setTimeout(() => {
				this.drawerParent.classList.add('rendered');
			});
		}, 100);
	};
	drawerUpdateParents = (height: number) => {
		if (this.parentDrawer) {
			this.parentDrawer.drawerSetMaxHeight(height);
			this.parentDrawer.drawerUpdateParents(height);
		}
	};

	private setContentDrawerState = (pageId: string) => {
		this.pageContentId = pageId;
		this.drawerSetState(appState.getContentDrawer(pageId, this.drawerId));
	};


*/
