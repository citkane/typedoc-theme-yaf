import {
	displayStates,
	yafDisplayOptions,
} from '../../../types/frontendTypes.js';
import { YafHTMLElement } from '../../index.js';
import appState from '../../lib/AppState.js';
import events from '../../lib/events/eventApi.js';
import { makeElement, flashElementBackground } from '../../yafElement.js';
import YafElementDrawers from '../../YafElementDrawers.js';

const { action, trigger } = events;

export class YafWidgetTagToggle extends YafHTMLElement<{
	drawers: YafElementDrawers;
}> {
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
	onConnect() {
		const { drawers } = this.props;
		const counts = drawers.flagCounts;
		(<yafDisplayOptions[]>Object.keys(counts)).forEach((flag) => {
			const count = counts[flag];
			if (!count) return;

			let display: displayStates = appState.options.display[flag];
			this.setAttribute(flag, display);

			display = display === 'hide' ? 'show' : 'hide';

			this.appendChild(
				makeElement('span', flag, `${display} [ ${count} ] ${flag}`)
			).onclick = (e) => {
				const newState = appState.toggleDisplayOption(flag);
				events.dispatch(action.options.display(flag, newState));
				events.dispatch(action.drawers.resetHeight());
				setTimeout(() => {
					(<HTMLElement>e.target).scrollIntoView({
						behavior: 'smooth',
						block: 'center',
					});
					flashElementBackground(e.target as HTMLElement);
				});
			};

			events.on(trigger.options.display, ({ detail }: CustomEvent) => {
				const { key, value } = detail;
				this.setAttribute(key, value);
			});
		});
	}
	disconnectedCallback() {
		console.warn('toggle disconnected');
		events.off(trigger.options.display, ({ detail }: CustomEvent) => {
			const { key, value } = detail;
			this.setAttribute(key, value);
		});
	}
}
const yafWidgetTagToggle = 'yaf-widget-tag-toggle';
customElements.define(yafWidgetTagToggle, YafWidgetTagToggle);
