import { YafElementDrawers } from '../YafElementDrawers.js';
import { YafWidgetKind } from './YafWidgets.js';

import events from '../lib/events/eventApi.js';
import appState from '../lib/AppState.js';

const { action } = events;

/**
 *
 */
export class YafNavigationHeader extends YafElementDrawers {
	constructor() {
		super(yafNavigationHeader);

		const infoLink = this.makeElement('span', 'info');
		infoLink.appendChild(this.makeIconSpan('question_mark', 18));
		infoLink.appendChild(this.makeIconSpan('highlight_off'));

		this.initDrawer(this, this.makeInfoDrawer(), infoLink, this.id);
	}
	connectedCallback() {
		if (this.debounce()) return;

		const navigationControls = this.makeElement('div');
		const homeLink = this.makeLinkElement('/', 'button');

		navigationControls.classList.add('controls-navigation');

		homeLink.appendChild(this.makeIconSpan('home'));
		navigationControls.appendChild(homeLink);
		navigationControls.appendChild(this.makeMenuRollControls());
		this.appendChild(navigationControls);
		this.appendChild(this.drawer);

		this.renderDrawer();
	}
	disconnectedCallback() {
		this.drawerHasDisconnected();
	}
	makeMenuRollControls = () => {
		const openAll = this.makeElement('span', 'open button');
		const closeAll = this.makeElement('span', 'close button');
		const drawerControls = this.makeElement('span', 'controls-drawers');

		openAll.appendChild(this.makeIconSpan('expand_more'));
		closeAll.appendChild(this.makeIconSpan('expand_less'));
		drawerControls.appendChild(this.drawerTrigger);
		drawerControls.appendChild(openAll);
		drawerControls.appendChild(closeAll);

		openAll.onclick = () => events.dispatch(action.content.rollMenuDown());
		closeAll.onclick = () => events.dispatch(action.content.rollMenuUp());

		return drawerControls;
	};
	makeInfoDrawer = () => {
		const kinds = [
			262144, 128, 512, 8, 64, 256, 2048, 4, 1024, 8388608, 32, 4194304,
			2,
		].sort();

		const infoDrawer = this.makeElement('div', 'drawers-info');
		const inner = this.makeElement('span', 'inner');

		kinds.forEach((kind) => {
			let nameString = appState.kindSymbols[kind].className;
			nameString =
				nameString.charAt(0).toUpperCase() + nameString.slice(1);

			const widget = this.makeElement('span', 'widget');
			const name = this.makeNameSpan(nameString);
			const kindIcon = this.makeElement<
				YafWidgetKind,
				YafWidgetKind['props']
			>('yaf-widget-kind', null, null, { kind: String(kind) });

			widget.appendChild(kindIcon);
			widget.appendChild(name);
			inner.appendChild(widget);
		});
		infoDrawer.appendChild(inner);

		return infoDrawer;
	};
}
const yafNavigationHeader = 'yaf-navigation-header';
customElements.define(yafNavigationHeader, YafNavigationHeader);
