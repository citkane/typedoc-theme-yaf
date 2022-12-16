import {
	displayStates,
	yafDisplayOptions,
} from '../../../types/frontendTypes.js';
import appState from '../../lib/AppState.js';
import events from '../../lib/events/eventApi.js';
import yafElement from '../../yafElement.js';
import YafElementDrawers from '../../YafElementDrawers.js';

const { action, trigger } = events;

const countFontSize = '0.9rem';

export class YafWidgetCounter extends HTMLElement {
	props!: { count: number | string; fontSize?: string };

	connectedCallback() {
		if (!this.props.fontSize) this.props.fontSize = countFontSize;

		this.innerHTML = `[ <span class='count'>${this.props.count}</span> ]`;
		if (this.props.fontSize)
			this.setAttribute('style', `font-size: ${this.props.fontSize};`);
	}
}
const yafWidgetCounter = 'yaf-widget-counter';
customElements.define(yafWidgetCounter, YafWidgetCounter);

export class YafWidgetKind extends HTMLElement {
	props!: { kind: string };
	connectedCallback() {
		const { kind } = this.props;
		if (kind) {
			const data = appState.kindSymbols[Number(kind)];
			this.classList.add(data.className || 'notfound');
			this.innerHTML = `<span>${data.symbol || '*'}</span>`;
		} else {
			this.parentElement?.removeChild(this);
		}
	}
}
const yafWidgetKind = 'yaf-widget-kind';
customElements.define(yafWidgetKind, YafWidgetKind);

export class YafWidgetTagToggle extends HTMLLIElement {
	props!: { drawers: YafElementDrawers };
	static get observedAttributes() {
		return ['inherited', 'private'];
	}
	attributeChangedCallback(
		name: yafDisplayOptions,
		oldValue: displayStates,
		newValue: displayStates
	) {
		if (!oldValue || oldValue === newValue) return;
		const span = this.querySelector(`.${name}`);
		if (!span) return;
		span.textContent = span.textContent!.replace(newValue, oldValue);
	}
	connectedCallback() {
		const { drawers } = this.props;
		const counts = drawers.flagCounts;
		(<yafDisplayOptions[]>Object.keys(counts)).forEach((flag) => {
			const count = counts[flag];
			if (!count) return;

			let display: displayStates = appState.options.display[flag];
			this.setAttribute(flag, display);

			display = display === 'hide' ? 'show' : 'hide';

			this.appendChild(
				yafElement.makeElement(
					'span',
					flag,
					`${display} [ ${count} ] ${flag}`
				)
			).onclick = (e) => {
				const newState = appState.toggleDisplayOption(flag);
				events.dispatch(action.options.display(flag, newState));
				events.dispatch(action.drawers.resetHeight());
				setTimeout(() => {
					(<HTMLElement>e.target).scrollIntoView({
						behavior: 'smooth',
						block: 'center',
					});
					yafElement.flashElementBackground(e.target as HTMLElement);
				});
			};

			events.on(trigger.options.display, ({ detail }: CustomEvent) => {
				const { key, value } = detail;
				this.setAttribute(key, value);
			});
		});
	}
	disconnectedCallback() {
		events.off(trigger.options.display, ({ detail }: CustomEvent) => {
			const { key, value } = detail;
			this.setAttribute(key, value);
		});
	}
}
const yafWidgetTagToggle = 'yaf-widget-tag-toggle';
customElements.define(yafWidgetTagToggle, YafWidgetTagToggle, {
	extends: 'li',
});
