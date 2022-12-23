import { appendChildren } from './yafElement.js';

export default class YafHtmlElement<
	T = Record<string, never>
> extends HTMLElement {
	props!: T;
	appendChildren = appendChildren(this);
	private debounceCount = 0;

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
