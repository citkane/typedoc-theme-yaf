import { componentName } from './types.js';
import { YafElement } from './YafElement.js';

export class YafElementDrawers extends YafElement {
	drawer!: HTMLElement;
	drawerParent!: HTMLElement;
	drawerTrigger!: HTMLElement;

	parentDrawer?: YafElementDrawers;
	debounceResize: ReturnType<typeof setTimeout> | null = null;
	drawerId!: number;
	context!: 'menu' | 'content' | undefined;

	constructor(componentName: componentName) {
		super(componentName);
	}
	drawerInit = (
		drawerParent: HTMLElement,
		drawer: HTMLElement,
		drawerTrigger: HTMLElement,
		id = NaN,
		context?: 'menu' | 'content'
	) => {
		this.drawer = drawer;
		this.drawerParent = drawerParent;
		this.drawerTrigger = drawerTrigger;
		this.drawerId = id;
		this.context = context;

		this.drawerParent.classList.add('yaf-parent-drawer');
		this.drawer.classList.add('yaf-drawer');

		this.drawerTrigger.addEventListener('click', () =>
			this.drawerToggleState()
		);
	};
	drawerHasConnected = () => {
		window.addEventListener('resize', () => this.drawerUpdateMaxHeight());
		this.drawerParent.appendChild(this.drawer);
		this.drawerSetMaxHeight();
		try {
			const menuState = this.context
				? window.yaf.menuState[this.context][this.drawerId] || 'closed'
				: 'closed';

			this.drawerSetState(menuState);
		} catch (err) {
			this.errors.localStorage('menuState');
			this.drawerSetState('closed');
		}

		setTimeout(() => {
			this.drawerParent.classList.add('rendered');
		});
	};
	drawerHasDisconnected = () => {
		window.removeEventListener('resize', () =>
			this.drawerUpdateMaxHeight()
		);
		this.drawerTrigger.removeEventListener('click', () =>
			this.drawerToggleState()
		);
	};
	private drawerSetState(state: 'open' | 'closed') {
		if (this.drawerParent.classList.contains(state)) return;
		if (this.context)
			window.yaf.menuState[this.context][this.drawerId] = state;

		this.drawerParent.classList.remove(
			state === 'open' ? 'closed' : 'open'
		);
		this.drawerParent.classList.add(state);
	}
	drawerToggleState = (state?: 'open' | 'closed') => {
		const newState = this.drawerParent.classList.contains('open')
			? 'closed'
			: 'open';

		if (state && state !== newState) return;

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
}
