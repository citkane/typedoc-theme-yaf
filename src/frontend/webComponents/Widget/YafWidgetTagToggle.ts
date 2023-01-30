import {
	displayStates,
	flagCounts,
	yafDisplayOptions,
	yafEventList,
} from '../../../types/frontendTypes.js';
import { YafHTMLElement } from '../../index.js';
import appState from '../../handlers/AppState.js';
import { makeElement, flashElementBackground } from '../../yafElement.js';
import { action, events } from '../../handlers/index.js';

const { action, trigger } = events;

export class YafWidgetTagToggle extends YafHTMLElement<{
	flagCounts: flagCounts;
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
		const HTMLElement = this.querySelector(`.${name}`);
		if (HTMLElement?.textContent)
			HTMLElement.textContent = HTMLElement.textContent.replace(
				newValue,
				oldValue
			);
	}
	onConnect() {
		const { factory } = YafWidgetTagToggle;
		const { flagCounts } = this.props;

		(<yafDisplayOptions[]>Object.keys(flagCounts)).forEach((flag) => {
			const count = flagCounts[flag];
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
				factory.handleClickAnimations(e);
			};

			this.eventList.forEach((event) => events.on(...event));
		});
	}
	disconnectedCallback() {
		this.eventList.forEach((event) => events.off(...event));
	}

	private eventList: yafEventList = [
		[
			trigger.options.display,
			({ detail }: CustomEvent<action['options']['display']>) => {
				const { key, value } = detail;
				this.setAttribute(key, value);
			},
		],
	];

	private static factory = {
		handleClickAnimations: (e: MouseEvent) => {
			setTimeout(() => {
				const target = e.target as HTMLElement;
				const container = getScrollContainer(target);

				container.classList.add('instant');
				container.scrollTop = target.offsetTop;
				container.classList.remove('instant');

				flashElementBackground(e.target as HTMLElement);
			});

			function getScrollContainer(target: HTMLElement): HTMLElement {
				return target.classList.contains('scroller')
					? target
					: getScrollContainer(target.parentElement!);
			}
		},
	};
}
const yafWidgetTagToggle = 'yaf-widget-tag-toggle';
customElements.define(yafWidgetTagToggle, YafWidgetTagToggle);
