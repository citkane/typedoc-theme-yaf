import { componentName } from '../../types/types.js';
import { YafElement } from '../YafElement.js';
import events from '../lib/events/eventApi.js';
import { YafElementDrawers } from '../YafElementDrawers.js';

const { trigger, action } = events;

const yafChromeContentName: componentName = 'yaf-chrome-content';

/**
 * **The app chrome wrapping around the main content portal.**
 *
 * This component deals primarily with opening drawers and scrolling to content.\
 * It reacts to location input events.
 */
export class YafChromeContent extends YafElement {
	constructor() {
		super(yafChromeContentName);
	}
	connectedCallback() {
		events.on(trigger.content.scrollTo, this.scrollToPlace);
		this.appendChild(this.getHtmlTemplate());
	}

	disconnectedCallback() {
		events.off(trigger.content.scrollTo, this.scrollToPlace);
	}
	scrollToPlace = (e: ReturnType<typeof action.content.scrollTo>) => {
		const position = e.detail.target;
		if (typeof position === 'number') return this.scrollTo(0, 0);
		const targetElement = document.getElementById(position);
		if (targetElement) {
			const drawerParent = this.findParentDrawer(targetElement);

			if (!drawerParent || drawerParent.classList.contains('open')) {
				targetElement.scrollIntoView();
			} else {
				drawerParent.toggleDrawerState();
				setTimeout(
					() => targetElement.scrollIntoView(),
					this.getAnimationDelay(drawerParent.drawer)
				);
			}
		} else {
			return this.errorHandlers.notFound(
				`Could not find element for "#${position}"`
			);
		}
	};
	findParentDrawer = (child: HTMLElement): YafElementDrawers | undefined => {
		const parent = child.parentElement! as {
			drawerToggleState?: undefined;
		};
		if (parent) {
			if (parent.drawerToggleState)
				return parent as unknown as YafElementDrawers;
			return this.findParentDrawer(parent as HTMLElement);
		}
		return undefined;
	};
	getAnimationDelay = (drawer: HTMLElement) => {
		const animationDelay = getComputedStyle(drawer).getPropertyValue(
			'transition-duration'
		);
		return parseFloat(animationDelay) * 1000;
	};
}
customElements.define(yafChromeContentName, YafChromeContent);

/**
 *
 */
export class YafChromeLeft extends YafElement {
	constructor() {
		super(yafChromeLeftName);
	}
	connectedCallback() {
		this.appendChild(this.getHtmlTemplate());
	}
}
const yafChromeLeftName: componentName = 'yaf-chrome-left';
customElements.define(yafChromeLeftName, YafChromeLeft);
