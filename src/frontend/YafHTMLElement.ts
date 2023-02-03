import { appendChildren } from './yafElement.js';

/**
 * A base class extension for all custom HTML WebComponents.
 *
 * It provides:
 *  - The often used `appendChildren` utility as a convenience to all Yaf components.
 *  - overrides the default `connectedCallback` with the purpose of providing a de-bouncer.\
 *    For inexplicable reasons, some nested custom WebComponents get multiple connected signals.
 */
export default class YafHtmlElement<
	T = Record<string, never>
> extends HTMLElement {
	props!: T;
	appendChildren = appendChildren(this);
	private debounceCount = 0;

	/**
	 * The standard Web Component connect entry.
	 *
	 * This debounces or triggers the new `onConnect` trigger used in all ancestor Yaf theme components.
	 */
	connectedCallback() {
		if (this.debounceCount) {
			/*
			console.debug(
				`${this.constructor.name} was debounced [${this.debounceCount}]`
			);
			*/
			this.debounceCount += 1;
			return;
		}
		this.debounceCount += 1;
		if ('onConnect' in this && typeof this.onConnect === 'function') {
			this.onConnect();
		}
	}
}
